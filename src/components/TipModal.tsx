import { useState } from "react";

interface TipModalProps {
  open: boolean;
  onClose: () => void;
  reporter: string;
}

const TIP_AMOUNTS = [50, 100, 200];

export function TipModal({ open, onClose, reporter }: TipModalProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  const handleSend = () => {
    if (selected) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setSelected(null);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-md bg-card border-t border-border rounded-t-2xl p-6 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {sent ? (
          <div className="text-center py-6">
            <p className="text-3xl mb-2">🎉</p>
            <p className="font-display font-bold text-lg text-foreground">Tip sent!</p>
            <p className="text-sm text-muted-foreground">₦{selected} sent to {reporter}</p>
          </div>
        ) : (
          <>
            <h3 className="font-display font-bold text-lg text-foreground mb-1">Tip {reporter}</h3>
            <p className="text-sm text-muted-foreground mb-4">Say thanks for the fuel update</p>

            <div className="flex gap-3 mb-4">
              {TIP_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => setSelected(amt)}
                  className={`flex-1 py-3 rounded-lg font-display font-bold text-lg transition-all ${
                    selected === amt
                      ? "fuel-gradient text-primary-foreground fuel-glow"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  ₦{amt}
                </button>
              ))}
            </div>

            <button
              onClick={handleSend}
              disabled={!selected}
              className="w-full py-3 rounded-lg font-display font-semibold text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed fuel-gradient text-primary-foreground"
            >
              Send Tip
            </button>
          </>
        )}
      </div>
    </div>
  );
}
