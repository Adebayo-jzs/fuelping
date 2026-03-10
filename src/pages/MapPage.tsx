import { MapPin, Flame } from "lucide-react";
import { useFuelReports } from "@/hooks/use-fuel-reports";

export default function MapPage() {
  const { reports } = useFuelReports();

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4">
        <h1 className="font-display font-bold text-lg text-foreground">Map View</h1>
      </header>

      {/* Map placeholder */}
      <div className="relative mx-4 mt-4 rounded-xl overflow-hidden border border-border bg-secondary h-[60vh] flex items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, hsl(36 95% 55% / 0.3) 0%, transparent 50%), 
                              radial-gradient(circle at 70% 60%, hsl(16 85% 55% / 0.2) 0%, transparent 50%)`,
          }} />
        </div>

        {/* Simulated pins */}
        {reports.map((report, i) => (
          <div
            key={report.id}
            className="absolute flex flex-col items-center animate-slide-up"
            style={{
              left: `${20 + (i * 15) % 60}%`,
              top: `${15 + (i * 20) % 60}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="fuel-gradient rounded-full p-1.5 fuel-glow">
              <Flame className="w-3 h-3 text-primary-foreground" />
            </div>
            <div className="mt-1 bg-card/90 backdrop-blur-sm rounded px-2 py-0.5 text-[10px] font-medium text-foreground whitespace-nowrap border border-border">
              ₦{report.price}
            </div>
          </div>
        ))}

        <div className="text-center z-10">
          <MapPin className="w-10 h-10 text-primary mx-auto mb-2 animate-pulse-glow" />
          <p className="text-sm font-medium text-muted-foreground">Interactive map coming soon</p>
          <p className="text-xs text-muted-foreground mt-1">Connect a map provider to enable</p>
        </div>
      </div>

      {/* List below map */}
      <div className="px-4 mt-4 space-y-2">
        {reports.map((report) => (
          <div key={report.id} className="flex items-center justify-between bg-card rounded-lg px-3 py-2.5 border border-border">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">{report.stationName}</p>
                <p className="text-xs text-muted-foreground">{report.distance} km away</p>
              </div>
            </div>
            <p className="font-display font-bold text-primary">₦{report.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
