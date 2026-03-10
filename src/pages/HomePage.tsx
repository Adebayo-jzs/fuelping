import { FuelCard } from "@/components/FuelCard";
import { useFuelReports } from "@/hooks/use-fuel-reports";
import { useLocation } from "@/hooks/use-location";
import { MapPin, Flame, Loader2 } from "lucide-react";

export default function HomePage() {
  const { reports, vote } = useFuelReports();
  const { location, loading } = useLocation();

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg fuel-gradient flex items-center justify-center">
              <Flame className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">Fuelping</h1>
          </div>
          {loading ? (
            <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
          ) : (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary" />
              <span>{location?.locality}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {["All", "PMS", "Diesel", "Gas"].map((filter) => (
            <button
              key={filter}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-colors first:fuel-gradient first:text-primary-foreground"
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {/* Live indicator */}
      <div className="px-4 py-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse-glow" />
        <span className="text-xs font-medium text-muted-foreground">
          {reports.length} live updates within 5 km
        </span>
      </div>

      {/* Feed */}
      <div className="px-4 space-y-3">
        {reports.map((report) => (
          <FuelCard key={report.id} report={report} onVote={vote} />
        ))}

        {reports.length === 0 && (
          <div className="text-center py-16">
            <Flame className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground font-medium">No recent updates nearby</p>
            <p className="text-xs text-muted-foreground mt-1">Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
}
