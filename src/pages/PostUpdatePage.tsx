import { useState } from "react";
import { ArrowLeft, Camera, MapPin } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "@/hooks/use-location";

export default function PostUpdatePage() {
  const navigate = useNavigate();
  const { location } = useLocation();
  const [stationName, setStationName] = useState("");
  const [fuelType, setFuelType] = useState<"PMS" | "Diesel" | "Gas">("PMS");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would call addReport
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border px-4 py-4 flex items-center gap-3">
        <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display font-bold text-lg text-foreground">Post Fuel Update</h1>
      </header>

      <form onSubmit={handleSubmit} className="p-4 space-y-5">
        {/* Station name */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Station Name</label>
          <input
            type="text"
            placeholder="e.g. Total Energies - Lekki"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            className="w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-lg px-4 py-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            required
          />
        </div>

        {/* Fuel type */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Fuel Type</label>
          <div className="flex gap-2">
            {(["PMS", "Diesel", "Gas"] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFuelType(type)}
                className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  fuelType === type
                    ? "fuel-gradient text-primary-foreground fuel-glow"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Price per Litre (₦)</label>
          <input
            type="number"
            placeholder="e.g. 617"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-secondary text-foreground placeholder:text-muted-foreground rounded-lg px-4 py-3 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            required
            min={1}
          />
        </div>

        {/* Photo */}
        <div>
          <label className="text-sm font-medium text-foreground mb-1.5 block">Photo (optional)</label>
          <button
            type="button"
            className="w-full py-8 rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors flex flex-col items-center gap-2"
          >
            <Camera className="w-6 h-6" />
            <span className="text-xs font-medium">Tap to add photo</span>
          </button>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary rounded-lg px-4 py-3">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{location?.locality || "Detecting location..."}</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3.5 rounded-lg font-display font-bold text-sm fuel-gradient text-primary-foreground fuel-glow hover:opacity-90 transition-opacity"
        >
          Post Update
        </button>
      </form>
    </div>
  );
}
