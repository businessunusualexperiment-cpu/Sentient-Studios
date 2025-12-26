import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Mentor } from "@shared/types";
import { api } from "@/lib/api-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, Mail, User, Loader2, CheckCircle, Clock, XCircle, MessageSquare } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Toaster, toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; // Import Textarea
export function MentorProfilePage() {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user, pendingConnections, mentorships, requestConnection } = useAuth();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRequesting, setIsRequesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [initialMessageText, setInitialMessageText] = useState(""); // State for the initial message
  const existingConnection = mentorId ? mentorships.find(c => c.mentorId === mentorId) : undefined;
  const isConnectionPending = mentorId ? pendingConnections.includes(mentorId) : false;
  const isActiveMentorship = existingConnection?.status === 'accepted';
  const isDeclinedMentorship = existingConnection?.status === 'declined';
  const isConnectionAlreadyMade = isConnectionPending || isActiveMentorship || isDeclinedMentorship;
  useEffect(() => {
    if (!mentorId) return;
    const fetchMentor = async () => {
      try {
        setIsLoading(true);
        const data = await api<Mentor>(`/api/mentors/${mentorId}`);
        setMentor(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch mentor profile.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentor();
  }, [mentorId]);
  const handleRequestConnection = async () => {
    if (!mentorId) return;
    if (!isAuthenticated || !user) {
      toast.error("Please log in to request a connection.", {
        action: {
          label: "Login",
          onClick: () => navigate('/login'),
        },
      });
      setIsDialogOpen(false);
      return;
    }
    setIsRequesting(true);
    try {
      await requestConnection(mentorId, initialMessageText); // Pass initialMessageText
      toast.success("Connection request sent successfully!");
    } catch (err) {
      toast.error("Failed to send connection request.");
    } finally {
      setIsRequesting(false);
      setIsDialogOpen(false);
      setInitialMessageText(""); // Clear message after sending
    }
  };
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container max-w-5xl px-4 py-12 md:py-16">
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <div className="md:col-span-1 flex flex-col items-center space-y-4">
              <Skeleton className="h-40 w-40 rounded-full" />
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-12 w-full" />
            </div>
            <div className="md:col-span-2 space-y-8">
              <div>
                <Skeleton className="h-8 w-32 mb-4" />
                <Skeleton className="h-24 w-full" />
              </div>
              <div>
                <Skeleton className="h-8 w-48 mb-4" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-28" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }
  if (error || !mentor) {
    return (
      <PageLayout>
        <div className="container text-center py-16">
          <p className="text-red-500">{error || "Mentor not found."}</p>
        </div>
      </PageLayout>
    );
  }
  const renderConnectionButton = () => {
    if (isActiveMentorship) {
      if (existingConnection?.chatId) {
        return (
          <Button
            size="lg"
            className="w-full bg-brand hover:bg-brand-600 text-white"
            onClick={() => navigate(`/chat/${existingConnection.chatId}`)}
          >
            <MessageSquare className="mr-2 h-5 w-5" /> Message Mentor
          </Button>
        );
      }
      return <Button size="lg" className="w-full" disabled><CheckCircle className="mr-2 h-5 w-5" /> Connected</Button>;
    }
    if (isDeclinedMentorship) {
      return <Button size="lg" className="w-full" disabled><XCircle className="mr-2 h-5 w-5" /> Request Declined</Button>;
    }
    if (isConnectionPending) {
      return <Button size="lg" className="w-full" disabled><Clock className="mr-2 h-5 w-5" /> Request Sent</Button>;
    }
    return (
      <Button
        size="lg"
        className="w-full bg-brand hover:bg-brand-600 text-white"
        onClick={() => setIsDialogOpen(true)}
        disabled={isConnectionAlreadyMade}
      >
        <Mail className="mr-2 h-5 w-5" /> Request Connection
      </Button>
    );
  };
  return (
    <PageLayout>
      <div className="container max-w-5xl px-4 py-12 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-3 gap-8 lg:gap-12"
        >
          <aside className="md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left space-y-6">
            <Avatar className="h-40 w-40 border-4 border-background shadow-lg">
              <AvatarImage src={mentor.imageUrl} alt={mentor.name} />
              <AvatarFallback>{mentor.name.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{mentor.name}</h1>
              <p className="text-lg text-muted-foreground">{mentor.title}</p>
              <p className="text-md text-muted-foreground/80 flex items-center justify-center md:justify-start gap-2">
                <Briefcase className="h-4 w-4" /> {mentor.company}
              </p>
            </div>
            <div className="w-full space-y-2">
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                {renderConnectionButton()}
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Connection Request</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to send a mentorship connection request to {mentor.name}?
                      You can also include an optional introductory message.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Textarea
                      placeholder={`Hi ${mentor.name}, I'm interested in connecting with you because...`}
                      value={initialMessageText}
                      onChange={(e) => setInitialMessageText(e.target.value)}
                      rows={5}
                    />
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost" disabled={isRequesting}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleRequestConnection} disabled={isRequesting} className="bg-brand hover:bg-brand-600">
                      {isRequesting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm Request
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </aside>
          <main className="md:col-span-2 space-y-10">
            <section>
              <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
                <User className="h-6 w-6 text-brand" /> About
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">{mentor.bio}</p>
            </section>
            <section>
              <h2 className="text-2xl font-bold mb-4">Skills & Expertise</h2>
              <div className="flex flex-wrap gap-3">
                {mentor.specialties.map((specialty) => (
                  <Badge key={specialty} className="text-base px-4 py-2" variant="default">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </section>
          </main>
        </motion.div>
      </div>
      <Toaster richColors closeButton />
    </PageLayout>
  );
}