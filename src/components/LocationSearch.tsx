import React, { useState, useEffect } from "react";
import { Search01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation } from "@/hooks/use-location";
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Location } from "@/lib/types";

export function LocationSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const { setLocation, location } = useLocation();

  useEffect(() => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&addressdetails=1&limit=5&countrycodes=ng`
        );
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Geocoding search failed:", error);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: any) => {
    const city = result.address.city || result.address.town || result.address.village || result.address.suburb || "";
    const state = result.address.state || "";
    
    setLocation({
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      city,
      state,
      locality: result.display_name
    });
    setOpen(false);
    setQuery("");
  };

  return (
    <div className="w-full max-w-sm">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button className="w-full flex items-center gap-2 px-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-muted-foreground hover:border-primary/50 transition-all text-left">
            <HugeiconsIcon icon={Search01Icon} className="w-4 h-4" />
            <span>{location?.city || "Search location..."}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
          <Command shouldFilter={false}>
            <CommandInput 
              placeholder="Type a city or area..." 
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              {query.length >= 3 && results.length === 0 && (
                <CommandEmpty>No results found.</CommandEmpty>
              )}
              <CommandGroup>
                {results.map((result) => (
                  <CommandItem
                    key={result.place_id}
                    onSelect={() => handleSelect(result)}
                    className="flex flex-col items-start gap-1 py-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <HugeiconsIcon icon={Location01Icon} className="w-4 h-4 text-primary" />
                      <span className="font-bold text-sm">
                        {result.address.city || result.address.town || result.display_name.split(',')[0]}
                      </span>
                    </div>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">
                      {result.display_name}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
