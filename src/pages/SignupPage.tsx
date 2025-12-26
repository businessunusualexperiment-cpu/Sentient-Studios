import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Toaster, toast } from 'sonner';
import { SignupFormValues } from '@/lib/schemas';
export function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const handleSignup = async (data: SignupFormValues) => {
    setIsLoading(true);
    try {
      await signup(data.email, data.password, data.name);
      // The hook will navigate on success
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Signup failed. Please try again.");
      setIsLoading(false);
    }
  };
  return (
    <PageLayout>
      <div className="container flex min-h-[calc(100vh-113px)] items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <AuthForm isSignup={true} onSubmit={handleSignup} isLoading={isLoading} />
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
      <Toaster richColors closeButton />
    </PageLayout>
  );
}