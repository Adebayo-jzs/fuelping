import { Flame, TrendingUp, Star, Award } from "lucide-react";

export default function ProfilePage() {
  const profile = {
    username: "FuelHero",
    reportsCount: 24,
    tipsEarned: 3450,
    trustScore: 92,
  };

  const recentTips = [
    { from: "LagosDriver", amount: 100, date: "2h ago" },
    { from: "NaijaRider", amount: 200, date: "5h ago" },
    { from: "CityExplorer", amount: 50, date: "1d ago" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="px-4 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl fuel-gradient flex items-center justify-center fuel-glow">
            <Flame className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-xl text-foreground">{profile.username}</h1>
            <p className="text-sm text-muted-foreground">Community Reporter</p>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="px-4 grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: TrendingUp, label: "Reports", value: profile.reportsCount },
          { icon: Star, label: "Tips Earned", value: `₦${profile.tipsEarned.toLocaleString()}` },
          { icon: Award, label: "Trust", value: `${profile.trustScore}%` },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg p-3 border border-border text-center">
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-1.5" />
            <p className="font-display font-bold text-foreground text-lg">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Recent tips */}
      <div className="px-4">
        <h2 className="font-display font-semibold text-foreground mb-3">Recent Tips Received</h2>
        <div className="space-y-2">
          {recentTips.map((tip, i) => (
            <div key={i} className="flex items-center justify-between bg-card rounded-lg px-4 py-3 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{tip.from}</p>
                <p className="text-xs text-muted-foreground">{tip.date}</p>
              </div>
              <p className="font-display font-bold text-success">+₦{tip.amount}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
