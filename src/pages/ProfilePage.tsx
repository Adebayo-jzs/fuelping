import { useState, useEffect } from "react";
import { Flame, TrendingUp, Star, Award, LogOut, Loader2, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 rounded-2xl fuel-gradient flex items-center justify-center fuel-glow mb-6">
          <Flame className="w-10 h-10 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-display font-bold mb-2">Track Your Impact</h1>
        <p className="text-muted-foreground mb-8 max-w-xs">
          Join the community to post updates, earn trust points, and help others find fuel.
        </p>
        <button
          onClick={() => navigate("/auth")}
          className="w-full max-w-xs py-4 rounded-2xl font-display font-bold text-lg fuel-gradient text-primary-foreground fuel-glow hover:opacity-95 transition-all flex items-center justify-center gap-2"
        >
          <LogIn className="w-5 h-5" />
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      <header className="px-4 pt-8 pb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl fuel-gradient flex items-center justify-center fuel-glow">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-2xl object-cover" />
            ) : (
              <Flame className="w-8 h-8 text-primary-foreground" />
            )}
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">
              {profile?.username || "FuelHunter"}
            </h1>
            <p className="text-sm text-muted-foreground">Community Reporter</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 rounded-xl bg-secondary text-muted-foreground hover:text-destructive transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </header>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: TrendingUp, label: "Reports", value: profile?.reports_count || 0 },
          { icon: Star, label: "Tips Earned", value: `₦${(profile?.tips_earned || 0).toLocaleString()}` },
          { icon: Award, label: "Trust", value: `${profile?.trust_score || 50}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-card/50 backdrop-blur-sm rounded-2xl p-4 border border-border text-center">
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="font-display font-bold text-foreground text-xl leading-none mb-1">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Rewards Card */}
      <div className="px-4 mb-8">
        <div className="bg-secondary/50 rounded-2xl p-6 border border-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl" />
          <h3 className="font-display font-bold text-lg mb-1 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Fuel Hunter Level 1
          </h3>
          <p className="text-xs text-muted-foreground mb-4">Post 5 more updates to reach Level 2</p>
          <div className="w-full h-2 bg-background rounded-full overflow-hidden">
            <div className="h-full fuel-gradient w-1/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
