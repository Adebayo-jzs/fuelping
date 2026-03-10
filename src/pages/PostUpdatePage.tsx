import { useState, useEffect } from "react";
import { ArrowLeft, Camera, MapPin, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "@/hooks/use-location";
import { useFuelReports } from "@/hooks/use-fuel-reports";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function PostUpdatePage() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const { addReport } = useFuelReports();
  const [stationName, setStationName] = useState("");
  const [fuelType, setFuelType] = useState<"PMS" | "Diesel" | "Gas">("PMS");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        toast.error("Please sign in to post updates");
        navigate("/auth");
      }
      setCheckingAuth(false);
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) {
      toast.error("Location access is required to post");
      return;
    }

    setLoading(true);
    try {
      await addReport({
        stationName,
        fuelType,
        price: parseInt(price),
        lat: location.lat,
        lng: location.lng,
      });
      navigate("/");
    } catch (error) {
      // Error handled in hook
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in text-foreground">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display font-bold text-lg">Post Fuel Update</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-6">
        <div className="space-y-4">
          {/* Station name */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Station Name</label>
            <input
              type="text"
              placeholder="e.g. Total Energies - Lekki"
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              className="w-full bg-secondary/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground rounded-2xl px-4 py-4 text-sm border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              required
            />
          </div>

          {/* Fuel type */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Fuel Type</label>
            <div className="flex gap-2">
              {(["PMS", "Diesel", "Gas"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFuelType(type)}
                  className={`flex-1 py-3.5 rounded-2xl font-bold text-sm transition-all ${
                    fuelType === type
                      ? "fuel-gradient text-primary-foreground fuel-glow scale-[1.02]"
                      : "bg-secondary/50 text-secondary-foreground hover:bg-secondary border border-transparent"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Price per Litre (₦)</label>
            <input
              type="number"
              placeholder="e.g. 617"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-secondary/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground rounded-2xl px-4 py-4 text-sm border border-border focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
              required
              min={1}
            />
          </div>

          {/* Photo */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-muted-foreground ml-1">Evidence (optional)</label>
            <button
              type="button"
              className="w-full py-10 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all flex flex-col items-center justify-center gap-2 group"
            >
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center group-hover:scale-110 transition-transform">
                <Camera className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold">Snap Price Board</span>
            </button>
          </div>

          {/* Location */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm rounded-2xl px-4 py-4 border border-border">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 overflow-hidden">
               <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Location Verified</p>
               <p className="truncate font-medium">{location?.locality || "Detecting your location..."}</p>
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || !location}
          className="w-full py-4 rounded-2xl font-display font-bold text-lg fuel-gradient text-primary-foreground fuel-glow hover:opacity-95 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            "Post Intelligence"
          )}
        </button>
      </form>
    </div>
  );
}
