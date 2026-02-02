'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signup') {
        const { error: signUpError } = await signUp(email, password, fullName);
        if (signUpError) throw signUpError;
        router.push('/dashboard');
      } else {
        const { error: signInError } = await signIn(email, password);
        if (signInError) throw signInError;
        router.push('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-purple-600 via-blue-600 to-pink-600 border-0 shadow-2xl shadow-purple-500/50">
      <CardHeader className="space-y-2">
        <CardTitle className="text-white text-xl sm:text-2xl">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</CardTitle>
        <CardDescription className="text-purple-100 text-sm sm:text-base">
          {mode === 'login'
            ? 'Sign in to manage your household budget'
            : 'Sign up to start tracking your budget with your household'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-white font-semibold">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
                className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-white font-semibold">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-white font-semibold">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="text-sm text-white bg-red-500/30 border border-red-400/50 p-3 rounded">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full bg-white text-purple-600 hover:bg-purple-50 font-bold" disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>

          <div className="text-center text-sm text-white">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <a href="/signup" className="text-yellow-300 hover:underline font-semibold">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <a href="/login" className="text-yellow-300 hover:underline font-semibold">
                  Sign in
                </a>
              </>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
