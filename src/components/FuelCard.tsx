import { FuelReport } from "@/lib/types";
import { Fuel, ThumbsUp, ThumbsDown, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { TipModal } from "./TipModal";

function timeAgo(date: Date): string {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

function fuelTypeColor(type: string) {
  switch (type) {
    case "PMS": return "bg-primary/20 text-primary";
    case "Diesel": return "bg-accent/20 text-accent";
    case "Gas": return "bg-success/20 text-success";
    default: return "bg-muted text-muted-foreground";
  }
}

interface FuelCardProps {
  report: FuelReport;
  onVote: (id: string, type: "up" | "down") => void;
}

export function FuelCard({ report, onVote }: FuelCardProps) {
  const [showTip, setShowTip] = useState(false);

  return (
    <>
      <div className="bg-card rounded-lg p-4 border border-border animate-slide-up">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Fuel className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-sm leading-tight">
                {report.stationName}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3" />
              <span>{report.distance} km away</span>
              <Clock className="w-3 h-3 ml-1" />
              <span>{timeAgo(report.timePosted)}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-xl text-primary">₦{report.price}</p>
            <span className="text-xs text-muted-foreground">/litre</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${fuelTypeColor(report.fuelType)}`}>
              {report.fuelType}
            </span>
            <span className="text-xs text-muted-foreground">by <span className="text-foreground font-medium">{report.reporter}</span></span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onVote(report.id, "up")}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-success/10 text-success hover:bg-success/20 transition-colors"
            >
              <ThumbsUp className="w-3 h-3" /> {report.upvotes}
            </button>
            <button
              onClick={() => onVote(report.id, "down")}
              className="flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
            >
              <ThumbsDown className="w-3 h-3" /> {report.downvotes}
            </button>
            <button
              onClick={() => setShowTip(true)}
              className="text-xs px-2 py-1 rounded-md fuel-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity ml-1"
            >
              Tip
            </button>
          </div>
        </div>
      </div>

      <TipModal
        open={showTip}
        onClose={() => setShowTip(false)}
        reporter={report.reporter}
      />
    </>
  );
}
