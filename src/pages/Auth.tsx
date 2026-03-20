import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            },
          },
        });
        if (error) throw error;
        toast.success("Signup successful! Please check your email for verification.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate("/");
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "An error occurred during authentication";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col p-6 animate-fade-in relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />

      <header className="mb-10 flex items-center gap-4">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl fuel-gradient flex items-center justify-center fuel-glow">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">Fuelping</h1>
        </div>
      </header>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="mb-8">
          <h2 className="text-3xl font-display font-bold text-foreground mb-2">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-muted-foreground">
            {isSignUp ? "Join the community of fuel hunters." : "Log in to track fuel updates near you."}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-secondary/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground rounded-2xl pl-12 pr-6 py-4 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                required={isSignUp}
              />
            </div>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-secondary/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground rounded-2xl pl-12 pr-6 py-4 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-secondary/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground rounded-2xl pl-12 pr-6 py-4 border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl font-display font-bold text-lg fuel-gradient text-primary-foreground fuel-glow hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              isSignUp ? "Sign Up" : "Sign In"
            )}
          </button>
        </form>

        <div className="mt-8 text-center px-4">
          <p className="text-muted-foreground mb-4">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary font-bold hover:underline transition-all"
          >
            {isSignUp ? "Switch to Sign In" : "Create New Account"}
          </button>
        </div>
      </div>

      <footer className="mt-auto pt-10 text-center text-xs text-muted-foreground">
        <p>&copy; 2026 Fuelping. Real-time fuel update.</p>
      </footer>
    </div>
  );
}
