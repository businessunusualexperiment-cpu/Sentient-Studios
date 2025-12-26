import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { AuthForm } from '@/components/AuthForm';
import { useAuth } from '@/hooks/useAuth';
import { Toaster, toast } from 'sonner';
import { LoginFormValues } from '@/lib/schemas';
export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const handleLogin = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      // The hook will navigate on success
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed. Please check your credentials.");
      setIsLoading(false);
    }
    // No need to setIsLoading(false) on success as the page will navigate away
  };
  return (
    <PageLayout>
      <div className="container flex min-h-[calc(100vh-113px)] items-center justify-center py-12">
        <div className="w-full max-w-md space-y-6">
          <AuthForm isSignup={false} onSubmit={handleLogin} isLoading={isLoading} />
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-brand hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Toaster richColors closeButton />
    </PageLayout>
  );
}