import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { UserProfileForm } from '@/components/UserProfileForm';
import { Toaster, toast } from 'sonner';
import { Edit, Loader2 } from 'lucide-react';
import { profileSchema } from '@/lib/schemas';
import * as z from 'zod';
export function UserProfilePage() {
  const { isAuthenticated, user, logout, updateProfile, isCurrentUserMentor, toggleMentorStatus } = useAuth();
  const navigate = useNavigate();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isToggleDialogOpen, setIsToggleDialogOpen] = useState(false);
  const [isTogglingMentorStatus, setIsTogglingMentorStatus] = useState(false);
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  const handleSaveProfile = async (data: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile({ name: data.name, bio: data.bio });
      toast.success("Profile updated successfully!");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };
  const handleToggleMentorStatus = async () => {
    setIsTogglingMentorStatus(true);
    try {
      await toggleMentorStatus(!isCurrentUserMentor);
      toast.success(`You are now ${!isCurrentUserMentor ? 'a mentor' : 'no longer a mentor'}.`);
    } catch (error) {
      toast.error("Failed to update mentor status.");
    } finally {
      setIsTogglingMentorStatus(false);
      setIsToggleDialogOpen(false);
    }
  };
  if (!user) {
    return (
      <PageLayout>
        <div className="container flex items-center justify-center h-full">
          {/* Optional: Add a skeleton loader here */}
        </div>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <div className="container max-w-4xl py-12 md:py-16">
        <Card className="overflow-hidden shadow-soft">
          <CardHeader className="flex flex-col md:flex-row items-start gap-4 bg-muted/50 p-6 border-b">
            <div className="flex flex-1 items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-background shadow-md">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${user.email}`} alt={user.name} />
                <AvatarFallback className="text-3xl">{user.name ? user.name.split(' ').map(n => n[0]).join('') : user.email.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="grid gap-0.5">
                <CardTitle className="text-3xl font-bold">{user.name || 'User'}</CardTitle>
                <CardDescription className="text-md">{user.email}</CardDescription>
              </div>
            </div>
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="w-full md:w-auto md:ml-auto gap-1.5">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                  <DialogTitle>Edit Your Profile</DialogTitle>
                </DialogHeader>
                <UserProfileForm
                  initialData={{
                    name: user.name || '',
                    email: user.email,
                    bio: user.bio || '',
                  }}
                  onSubmit={handleSaveProfile}
                  onCancel={() => setIsEditDialogOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="p-6 text-base space-y-8">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">About Me</h3>
              <p className="text-muted-foreground leading-relaxed">
                {user.bio || "No bio provided. Click 'Edit Profile' to add one."}
              </p>
            </div>
            <div className="space-y-4 p-4 border rounded-lg bg-background">
              <h3 className="text-lg font-semibold">Mentor Status</h3>
              <p className="text-muted-foreground">
                {isCurrentUserMentor
                  ? "You are currently listed as a mentor. Mentees can find your profile and send you connection requests."
                  : "You are not currently listed as a mentor. To become a mentor and help others, enable mentor status."}
              </p>
              <Dialog open={isToggleDialogOpen} onOpenChange={setIsToggleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant={isCurrentUserMentor ? "destructive" : "default"} className={!isCurrentUserMentor ? "bg-brand hover:bg-brand-600" : ""}>
                    {isCurrentUserMentor ? 'Disable Mentor Status' : 'Become a Mentor'}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Action</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to {isCurrentUserMentor ? 'disable your mentor status' : 'become a mentor'}?
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="ghost" disabled={isTogglingMentorStatus}>Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleToggleMentorStatus} disabled={isTogglingMentorStatus}>
                      {isTogglingMentorStatus && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        <div className="mt-6 flex justify-end">
            <Button onClick={logout} variant="destructive">
              Logout
            </Button>
        </div>
      </div>
      <Toaster richColors closeButton />
    </PageLayout>
  );
}