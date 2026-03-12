import { FuelReport } from "@/lib/types"; 
import { useState, useEffect } from "react";
import { TipModal } from "./TipModal";
import { HugeiconsIcon } from "@hugeicons/react";
import { Clock01Icon, FuelStationIcon, Location01Icon,ThumbsDownIcon,ThumbsUpIcon } from "@hugeicons/core-free-icons";

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
  const initialLocality = report.locality && report.state 
    ? `${report.locality}, ${report.state}` 
    : (report.locality || report.state || "");
  const [locality, setLocality] = useState<string>(initialLocality);

  useEffect(() => {
    if (report.locality && report.state) return;

    const fetchLocality = async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`,
        );
        const data = await response.json();
        const city = data.city || data.locality || "";
        const state = data.principalSubdivision || "";

        return city && state ? `${city}, ${state}` : (city || state || "Lagos, Nigeria");
      } catch (err) {
        console.error("Reverse geocoding failed:", err);
        return "Lagos, Nigeria";
      }
    };

    fetchLocality(report.lat, report.lng).then(setLocality);
  }, [report.lat, report.lng, report.locality, report.state]);
  return (
    <>
      <div className="bg-card rounded-lg p-4 border border-border animate-slide-up">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <HugeiconsIcon icon={FuelStationIcon} className="w-4 h-4 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-sm leading-tight">
                {report.stationName}
              </h3>
            </div>
            <div className="flex-col flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1 min-w-0 max-w-[280px]">
                <HugeiconsIcon icon={Location01Icon} className="w-3 h-3 flex-shrink-0" />
                <span className="">{locality || "Loading..."}</span>
                <span className="hiddn xs:inline text-muted-foreground/30">•</span>
                <span className="whitespace-nowrap">{report.distance} km away</span>
              </div>
              <div className="flex items-center gap-1 whitespace-nowrap ml-auto sm:ml-0">
                <HugeiconsIcon icon={Clock01Icon} className="w-3 h-3" />
                <span>{timeAgo(report.timePosted)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="font-display font-bold text-xl text-primary">₦{report.price}</p>
            <span className="text-xs text-muted-foreground">/{report.fuelType === "Gas" ? "kg" : "litre"}</span>
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
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                report.userVote === "up" 
                  ? "bg-success text-success-foreground" 
                  : "bg-success/10 text-success hover:bg-success/20"
              }`}
            >
               <HugeiconsIcon  icon={ThumbsUpIcon} className={`w-3 h-3 ${report.userVote === "up" ? "fill-current" : ""}`} /> {report.upvotes}
            </button>
            <button
              onClick={() => onVote(report.id, "down")}
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-md transition-colors ${
                report.userVote === "down" 
                  ? "bg-destructive text-destructive-foreground" 
                  : "bg-destructive/10 text-destructive hover:bg-destructive/20"
              }`}
            >
              <HugeiconsIcon  icon={ThumbsDownIcon} className={`w-3 h-3 ${report.userVote === "down" ? "fill-current" : ""}`} /> {report.downvotes}
            </button>
            {/* <button
              onClick={() => setShowTip(true)}
              className="text-xs px-2 py-1 rounded-md fuel-gradient text-primary-foreground font-semibold hover:opacity-90 transition-opacity ml-1"
            >
              Tip
            </button> */}
          </div>
        </div>
      </div>

      {/* <TipModal
        open={showTip}
        onClose={() => setShowTip(false)}
        reporter={report.reporter}
      /> */}
    </>
  );
}
