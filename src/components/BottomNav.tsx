// import { Home, MapPin, Plus, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { User03Icon,Money01Icon,Location01Icon,Plus ,Home01Icon} from "@hugeicons/core-free-icons";

const tabs = [
  { path: "/", icon: Home01Icon, label: "Home" },
  { path: "/map", icon: Location01Icon, label: "Map" },
  { path: "/post", icon: Plus, label: "Post", highlight: true },
  { path: "/profile", icon: User03Icon, label: "Profile" },
  { path: "/Sponsor", icon: Money01Icon, label: "Sponsor" },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-md border-t border-border">
      <div className="flex items-center justify-around max-w-md mx-auto h-16">
        {tabs.map((tab) => {
          const active = location.pathname === tab.path;
          const Icon = tab.icon;

          if (tab.highlight) {
            return (
              <Link
                key={tab.path}
                to={tab.path}
                className="flex items-center justify-center w-12 h-12 -mt-4 rounded-full fuel-gradient fuel-glow shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <HugeiconsIcon icon={Icon} className="w-5 h-5 text-primary-foreground" />
              </Link>
            );
          }

          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                active ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <HugeiconsIcon icon={Icon} className="w-5 h-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
