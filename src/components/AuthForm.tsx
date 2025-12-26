import * as React from 'react';
import { useForm, SubmitHandler, Control, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { loginSchema, signupSchema, LoginFormValues, SignupFormValues } from '@/lib/schemas';
type AuthFormProps = {
  isSignup: boolean;
  onSubmit: SubmitHandler<LoginFormValues> | SubmitHandler<SignupFormValues>;
  isLoading?: boolean;
  error?: string | null;
};
export function AuthForm({
  isSignup,
  onSubmit,
  isLoading = false,
}: AuthFormProps) {
  const schema = isSignup ? signupSchema : loginSchema;
  const defaultValues = isSignup
    ? { name: '', email: '', password: '' }
    : { email: '', password: '' };
  const form = useForm<typeof isSignup extends true ? SignupFormValues : LoginFormValues>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any, // Cast needed due to conditional type
  });
  const handleSubmitWrapper = (data: LoginFormValues | SignupFormValues) => {
    if (isSignup) {
      (onSubmit as SubmitHandler<SignupFormValues>)(data as SignupFormValues);
    } else {
      (onSubmit as SubmitHandler<LoginFormValues>)(data as LoginFormValues);
    }
  };
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">{isSignup ? 'Create an Account' : 'Welcome Back'}</CardTitle>
        <CardDescription>{isSignup ? 'Enter your details to get started.' : 'Sign in to continue.'}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitWrapper)} className="space-y-6">
            {isSignup && (
              <FormField
                control={form.control as any}
                name={'name' as Path<SignupFormValues>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control as any}
              name={'email' as Path<LoginFormValues | SignupFormValues>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control as any}
              name={'password' as Path<LoginFormValues | SignupFormValues>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-brand hover:bg-brand-600" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSignup ? 'Sign Up' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}