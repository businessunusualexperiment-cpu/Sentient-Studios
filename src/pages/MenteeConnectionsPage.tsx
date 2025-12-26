import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { Mentor, Connection } from '@shared/types';
import { api } from '@/lib/api-client';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConnectionCard } from '@/components/ConnectionCard';
import { Toaster, toast } from 'sonner';
export function MenteeConnectionsPage() {
  const { isAuthenticated, mentorships } = useAuth();
  const navigate = useNavigate();
  const [mentorsDetails, setMentorsDetails] = useState<Mentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  useEffect(() => {
    const fetchMentorsDetails = async () => {
      if (!isAuthenticated || mentorships.length === 0) {
        setIsLoading(false);
        setMentorsDetails([]);
        return;
      }
      setIsLoading(true);
      try {
        const mentorIds = [...new Set(mentorships.map(m => m.mentorId))];
        if (mentorIds.length === 0) {
            setMentorsDetails([]);
            return;
        }
        const mentors = await Promise.all(mentorIds.map(id => api<Mentor>(`/api/mentors/${id}`)));
        setMentorsDetails(mentors);
      } catch (error) {
        console.error("Failed to fetch mentors details", error);
        toast.error("Could not load mentor details for your connections.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMentorsDetails();
  }, [mentorships, isAuthenticated]);
  const renderConnectionsList = (connections: Connection[]) => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-4 p-4 border rounded-lg"><Skeleton className="h-32 w-full" /><Skeleton className="h-6 w-3/4" /></div>
          ))}
        </div>
      );
    }
    if (connections.length === 0) {
      const status = mentorships.find(c => c.status)?.status || 'connections';
      const message = `You have no ${status} yet.`;
      return (
        <div className="text-center py-16 border rounded-lg bg-muted/20">
          <p className="text-muted-foreground">{message}</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {connections.map(conn => {
          const mentor = mentorsDetails.find(m => m.id === conn.mentorId);
          if (!mentor) return null;
          return (
            <ConnectionCard
              key={conn.id}
              mentor={mentor}
              connection={conn}
              chatId={conn.chatId} // Pass chatId
            />
          );
        })}
      </div>
    );
  };
  const pending = mentorships.filter(c => c.status === 'pending');
  const accepted = mentorships.filter(c => c.status === 'accepted');
  const declined = mentorships.filter(c => c.status === 'declined');
  return (
    <PageLayout>
      <div className="container max-w-7xl px-4 py-12 md:py-16">
        <div className="space-y-4 mb-12">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">My Connections</h1>
          <p className="text-lg text-muted-foreground">Manage your pending and active mentorships.</p>
        </div>
        <Tabs defaultValue="accepted" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="accepted">Accepted</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="declined">Declined</TabsTrigger>
          </TabsList>
          <TabsContent value="accepted" className="mt-8">
            {renderConnectionsList(accepted)}
          </TabsContent>
          <TabsContent value="pending" className="mt-8">
            {renderConnectionsList(pending)}
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