import { useState } from "react";
import { 
  Location01Icon, 
  FireIcon, 
  FilterIcon,
  InformationCircleIcon
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFuelReports } from "@/hooks/use-fuel-reports";

export default function MapPage() {
  const { reports } = useFuelReports();
  const [filter, setFilter] = useState<"All" | "PMS" | "Diesel" | "Gas">("All");

  const filteredReports = reports.filter(r => 
    filter === "All" || r.fuelType === filter
  );

  const getFuelColor = (type: string) => {
    switch (type) {
      case "PMS": return "text-orange-500";
      case "Diesel": return "text-green-500";
      case "Gas": return "text-cyan-500";
      default: return "text-primary";
    }
  };

  const getFuelBg = (type: string) => {
    switch (type) {
      case "PMS": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "Diesel": return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Gas": return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      default: return "bg-primary/20 text-primary border-primary/30";
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 animate-fade-in">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="font-display font-bold text-xl text-foreground">Nearby Stations</h1>
          <HugeiconsIcon icon={FilterIcon} className="w-5 h-5 text-muted-foreground" />
        </div>
        
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {["All", "PMS", "Diesel", "Gas"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                filter === type 
                  ? "fuel-gradient text-primary-foreground border-transparent fuel-glow" 
                  : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </header>

      {/* Map placeholder */}
      <div className="relative mx-4 mt-4 rounded-3xl overflow-hidden border border-primary/20 bg-secondary/30 h-[50vh] flex items-center justify-center fuel-glow-subtle">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at ${30}% ${40}%, var(--primary) 0%, transparent 50%), 
                              radial-gradient(circle at ${70}% ${60}%, hsl(var(--primary)) 0%, transparent 50%)`,
            filter: 'blur(60px)'
          }} />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
        </div>

        {/* Simulated pins */}
        {filteredReports.map((report, i) => (
          <div
            key={report.id}
            className="absolute flex flex-col items-center animate-slide-up group"
            style={{
              left: `${20 + (i * 22) % 65}%`,
              top: `${15 + (i * 18) % 65}%`,
              animationDelay: `${i * 0.1}s`,
            }}
          >
            <div className="relative flex flex-col items-center">
              <div className={`rounded-xl p-2 backdrop-blur-md border shadow-lg transition-transform group-hover:scale-110 ${getFuelBg(report.fuelType)}`}>
                <HugeiconsIcon icon={FireIcon} className="w-4 h-4" />
              </div>
              <div className="mt-1.5 bg-card/95 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] font-bold text-foreground whitespace-nowrap border border-border/50 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                {report.stationName} • ₦{report.price}
              </div>
            </div>
          </div>
        ))}

        <div className="text-center z-10 bg-background/40 backdrop-blur-md p-6 rounded-3xl border border-white/5 shadow-2xl mx-4">
          <HugeiconsIcon icon={Location01Icon} className="w-10 h-10 text-primary mx-auto mb-3 animate-pulse-glow" />
          <p className="text-md font-bold text-foreground mb-1">Interactive Map Coming Soon</p>
          <p className="text-xs text-muted-foreground">We're working on bringing live navigation to your area.</p>
        </div>
      </div>

      {/* List below map */}
      <div className="px-4 mt-6 space-y-3">
        <div className="flex items-center gap-2 mb-2">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-4 h-4 text-primary" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Live Insights</h2>
        </div>
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="group flex items-center justify-between bg-card/40 backdrop-blur-sm rounded-2xl p-4 border border-border/50 hover:border-primary/30 transition-all hover:bg-card/60">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${getFuelBg(report.fuelType)}`}>
                  <HugeiconsIcon icon={FireIcon} className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-foreground">{report.stationName}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-md border font-bold ${getFuelBg(report.fuelType)}`}>
                      {report.fuelType}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-medium mt-0.5">{report.distance} km away</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-display font-black text-lg text-primary leading-none">₦{report.price}</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">per litre</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-secondary/20 rounded-3xl border border-dashed border-border">
            <HugeiconsIcon icon={InformationCircleIcon} className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No {filter} reports in this area</p>
          </div>
        )}
      </div>
    </div>
  );
}
