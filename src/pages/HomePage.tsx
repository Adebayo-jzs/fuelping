import { useState, useEffect } from "react";
import { FuelCard } from "@/components/FuelCard";
import { useFuelReports } from "@/hooks/use-fuel-reports";
import { useLocation } from "@/hooks/use-location";
import { MapPin, Flame, Loader2, LogIn, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function HomePage() {
  const navigate = useNavigate();
  const { reports, vote, loading: reportsLoading } = useFuelReports();
  const { location, loading: locationLoading } = useLocation();
  const [session, setSession] = useState<any>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const filteredReports = reports.filter(r => 
    filter === "All" || r.fuelType === filter
  );

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl fuel-gradient flex items-center justify-center fuel-glow">
              <Flame className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-2xl tracking-tight text-foreground">Fuelping</h1>
          </div>
          
          <div className="flex items-center gap-3">
            {!session ? (
              <button 
                onClick={() => navigate("/auth")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-all text-xs font-bold"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            ) : (
              <button 
                onClick={() => navigate("/profile")}
                className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary transition-colors border border-border"
              >
                <User className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          {locationLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 text-muted-foreground animate-spin" />
              <span className="text-xs text-muted-foreground">Detecting...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-secondary/50 border border-border/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              <MapPin className="w-3 h-3 text-primary" />
              <span>{location?.locality || "Earth"}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {["All", "PMS", "Diesel", "Gas"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                filter === f
                  ? "fuel-gradient text-primary-foreground fuel-glow"
                  : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      {/* Live indicator & Feed */}
      <div className="px-4 py-4">
        {reportsLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground">Scanning for fuel intel...</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 mb-4">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-success animate-ping" />
              </div>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {filteredReports.length} Active Intel Reports
              </span>
            </div>

            <div className="space-y-4">
              {filteredReports.map((report) => (
                <FuelCard key={report.id} report={report} onVote={vote} />
              ))}

              {filteredReports.length === 0 && (
                <div className="text-center py-20 bg-secondary/20 rounded-3xl border-2 border-dashed border-border/50">
                  <Flame className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground font-bold italic">No {filter !== "All" ? filter : ""} intel found nearby</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-widest font-bold">Be the first to report</p>
                  <button 
                    onClick={() => navigate("/post")}
                    className="mt-6 px-6 py-2.5 rounded-xl bg-primary/10 text-primary font-bold text-sm hover:bg-primary/20 transition-all"
                  >
                    Post Intel
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
