import React, { useState } from 'react';
    import Button from '../components/Button';
    import StatusBar from '../components/StatusBar';
    import { supabase } from '../services/supabase';

    const AuthPage = ({ onLogin }) => {
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(null);

      const handleSignUp = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });
          if (error) throw error;
          onLogin(data.session.access_token);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const handleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          onLogin(data.session.access_token);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
          });
          if (error) throw error;
          onLogin(data.session.access_token);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      const handleGitHubSignIn = async () => {
        setLoading(true);
        setError(null);
        try {
          const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
          });
          if (error) throw error;
          onLogin(data.session.access_token);
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      };

      return (
        <div className="flex flex-col min-h-screen">
          <StatusBar />
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col items-center justify-center">
              <Logo />
              <h1 className="text-2xl font-bold text-white mb-6">Voice Notes</h1>
            </div>
            <div className="bg-gradient-to-b from-neutral-800/0 to-neutral-800 to-60% pt-12 pb-12">
              <div className="flex flex-col items-center gap-4">
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-black"
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-black"
                />
                <div className="flex gap-2">
                  <Button label="Sign Up" onClick={handleSignUp} disabled={loading} />
                  <Button label="Sign In" onClick={handleSignIn} disabled={loading} />
                </div>
                <div className="flex gap-2">
                  <Button label="Sign In with Google" onClick={handleGoogleSignIn} disabled={loading} />
                  <Button label="Sign In with GitHub" onClick={handleGitHubSignIn} disabled={loading} />
                </div>
                {error && <p className="text-red-500">{error}</p>}
              </div>
            </div>
          </div>
        </div>
      );
    };

    const Logo = () => (
      <svg
        className="w-16 h-16 mb-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="white"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
        />
      </svg>
    );

    export default AuthPage;
