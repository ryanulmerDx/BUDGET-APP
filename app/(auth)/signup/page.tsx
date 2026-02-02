import AuthForm from '@/components/auth/AuthForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <AuthForm mode="signup" />
    </div>
  );
}
