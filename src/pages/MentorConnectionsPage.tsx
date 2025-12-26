import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { Mentor, Connection, User } from '@shared/types';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionCard } from '@/components/ConnectionCard';
import { Toaster, toast } from 'sonner';
type AuthUser = Omit<User, 'passwordHash'>;
export function MentorConnectionsPage() {
  const { isAuthenticated, user, isCurrentUserMentor, mentorRespondToConnectionRequest } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [menteesDetails, setMenteesDetails] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [respondingConnectionId, setRespondingConnectionId] = useState<string | null>(null);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!isCurrentUserMentor) {
      toast.error("You are not authorized to view this page.");
      navigate('/profile');
    }
  }, [isAuthenticated, isCurrentUserMentor, navigate]);
  useEffect(() => {
    const fetchConnections = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      try {
        const data = await api<Connection[]>(`/api/connections/mentor/${user.id}`);
        setConnections(data);
      } catch (error) {
        console.error("Failed to fetch mentor connections", error);
        toast.error("Could not load your connections.");
      } finally {
        setIsLoading(false);
      }
    };
    if (isCurrentUserMentor) {
      fetchConnections();
    }
  }, [user, isCurrentUserMentor]);
  useEffect(() => {
    const fetchMenteesDetails = async () => {
      if (connections.length === 0) {
        setMenteesDetails([]);
        return;
      }
      try {
        const menteeIds = [...new Set(connections.map(c => c.menteeId))];
        // In a real app, this would be a single API call, e.g., /api/users?ids=...
        const usersResponse = await api<{ items: AuthUser[] }>('/api/users');
        const allUsers = usersResponse.items;
        const mentees = allUsers.filter(u => menteeIds.includes(u.id));
        setMenteesDetails(mentees);
      } catch (error) {
        console.error("Failed to fetch mentees details", error);
        toast.error("Could not load mentee details.");
      }
    };
    fetchMenteesDetails();
  }, [connections]);
  const handleRespondToRequest = async (connectionId: string, status: 'accepted' | 'declined') => {
    setRespondingConnectionId(connectionId);
    try {
      await mentorRespondToConnectionRequest(connectionId, status);
      // Optimistically update UI
      setConnections(prev => prev.map(c => c.id === connectionId ? { ...c, status } : c));
      toast.success(`Request ${status}.`);
    } catch (error) {
      toast.error("Failed to respond to request.");
    } finally {
      setRespondingConnectionId(null);
    }
  };
  const renderConnectionsList = (connectionsToRender: Connection[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4 p-4 border rounded-lg"><Skeleton className="h-32 w-full" /><Skeleton className="h-6 w-3/4" /></div>
          ))}
        </div>
      );
    }
    if (connectionsToRender.length === 0) {
      return (
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">No connections in this category.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {connectionsToRender.map(conn => {
          const mentee = menteesDetails.find(m => m.id === conn.menteeId);
          if (!mentee) return null;
          // Adapt mentee User object to fit Mentor props for ConnectionCard
          const cardData: Mentor = {
            id: mentee.id,
            name: mentee.name,
            title: mentee.email,
            company: 'Mentee',
            specialties: [],
            bio: mentee.bio || '',
            imageUrl: `https://i.pravatar.cc/300?u=${mentee.email}`
          };
          return (
            <ConnectionCard
              key={conn.id}
              mentor={cardData}
              connection={conn}
              onAccept={(connId) => handleRespondToRequest(connId, 'accepted')}
              onDecline={(connId) => handleRespondToRequest(connId, 'declined')}
              isResponding={respondingConnectionId === conn.id}
              initialMessage={conn.initialMessage}
              chatId={conn.chatId} // Pass chatId
            />
          );
        })}
      </div>
    );
  };
  const pending = connections.filter(c => c.status === 'pending');
  const accepted = connections.filter(c => c.status === 'accepted');
  const declined = connections.filter(c => c.status === 'declined');
  return (
    <PageLayout>
      <div className="container max-w-7xl px-4 py-12 md:py-16">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Mentor Dashboard</h1>
          <p className="text-lg text-muted-foreground">Manage your incoming mentorship requests.</p>
        </div>
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </TabsList>
          <TabsContent value="pending" className="mt-8">
            {renderConnectionsList(pending)}
          </TabsContent>
          <TabsContent value="accepted" className="mt-8">
            {renderConnectionsList(accepted)}
          </TabsContent>
          <TabsContent value="declined" className="mt-8">
            {renderConnectionsList(declined)}
          </TabsContent>
        </Tabs>
      </div>
      <Toaster richColors closeButton />
    </PageLayout>
  );
}