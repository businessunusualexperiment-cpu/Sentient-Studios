import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { Chat, ChatMessage, User } from '@shared/types';
import { api } from '@/lib/api-client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send } from 'lucide-react';
import { Toaster, toast } from 'sonner';
export function ChatPage() {
  const { chatId } = useParams<{ chatId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, fetchChatMessages, sendChatMessage } = useAuth();
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Map to store user details for messages (sender)
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map());
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!chatId) {
      setError("Chat ID is missing.");
      setIsLoading(false);
      return;
    }
    const fetchChatDetails = async () => {
      try {
        const chatData = await api<Chat>(`/api/chats/${chatId}`);
        setChat(chatData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch chat details.");
        console.error(err);
      }
    };
    const loadMessages = async () => {
      try {
        const fetchedMessages = await fetchChatMessages(chatId);
        setMessages(fetchedMessages);
        // Fetch user details for all message senders
        const senderIds = [...new Set(fetchedMessages.map(m => m.userId))];
        const usersResponse = await api<{ items: User[] }>('/api/users');
        const fetchedUsers = usersResponse.items.filter(u => senderIds.includes(u.id));
        const newUsersMap = new Map(fetchedUsers.map(u => [u.id, u]));
        setUsersMap(newUsersMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch messages.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatDetails();
    loadMessages();
    // Polling for new messages
    const pollInterval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(pollInterval); // Cleanup on unmount
  }, [chatId, isAuthenticated, navigate, fetchChatMessages]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user?.id || !chatId) return;
    setIsSending(true);
    try {
      const sentMessage = await sendChatMessage(chatId, newMessage.trim());
      setMessages(prev => [...prev, sentMessage]);
      setNewMessage('');
    } catch (err) {
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container max-w-3xl py-12 md:py-16 flex items-center justify-center min-h-[calc(100vh-113px)]">
          <Loader2 className="h-8 w-8 animate-spin text-brand" />
          <p className="ml-2 text-muted-foreground">Loading chat...</p>
        </div>
      </PageLayout>
    );
  }
  if (error) {
    return (
      <PageLayout>
        <div className="container text-center py-16">
          <p className="text-red-500">{error}</p>
        </div>
      </PageLayout>
    );
  }
  if (!chat) {
    return (
      <PageLayout>
        <div className="container text-center py-16">
          <p className="text-muted-foreground">Chat not found.</p>
        </div>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <div className="container max-w-3xl py-12 md:py-16 min-h-[calc(100vh-113px)] flex flex-col">
        <Card className="flex flex-col flex-1 max-h-[80vh]">
          <CardHeader className="border-b p-4">
            <CardTitle className="text-2xl font-bold">{chat.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No messages yet. Start the conversation!</div>
                ) : (
                  messages.map((msg) => {
                    const sender = usersMap.get(msg.userId);
                    const isCurrentUser = msg.userId === user?.id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                      >
                        {!isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${sender?.email || msg.userId}`} alt={sender?.name || 'Unknown'} />
                            <AvatarFallback>{sender?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}>
                          <span className="text-xs text-muted-foreground mb-1">
                            {sender?.name || 'Unknown'} - {new Date(msg.ts).toLocaleTimeString()}
                          </span>
                          <div
                            className={`max-w-[70%] rounded-lg px-4 py-2 ${
                              isCurrentUser
                                ? 'bg-brand text-white rounded-br-none'
                                : 'bg-muted text-foreground rounded-bl-none'
                            }`}
                          >
                            <p className="text-sm">{msg.text}</p>
                          </div>
                        </div>
                        {isCurrentUser && (
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${user?.email || msg.userId}`} alt={user?.name || 'You'} />
                            <AvatarFallback>{user?.name?.charAt(0).toUpperCase() || '?'}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="border-t p-4">
            <div className="flex w-full items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isSending) {
                    handleSendMessage();
                  }
                }}
                disabled={isSending || !user?.id}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={isSending || !newMessage.trim()} className="bg-brand hover:bg-brand-600">
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <Toaster richColors closeButton />
    </PageLayout>
  );
}