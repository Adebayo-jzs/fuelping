import React, { useEffect, useRef, useState } from "react";
import { Search01Icon, Location01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocation } from "@/hooks/use-location";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface NominatimAddress {
  city?: string;
  town?: string;
  village?: string;
  suburb?: string;
  state?: string;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: NominatimAddress;
}

const MIN_QUERY_LENGTH = 3;
const SEARCH_DEBOUNCE_MS = 350;

const getPrimaryLocationName = (result: NominatimResult) => {
  const address = result.address;
  return address?.city || address?.town || address?.village || address?.suburb || result.display_name.split(",")[0];
};

export function LocationSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setLocation, location } = useLocation();
  const searchRequestId = useRef(0);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }

    const requestId = ++searchRequestId.current;
    const abortController = new AbortController();
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmedQuery)}&addressdetails=1&limit=5&countrycodes=ng`,
          {
            signal: abortController.signal,
            headers: {
              Accept: "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Location search failed");
        }

        const data = (await response.json()) as NominatimResult[];

        if (requestId !== searchRequestId.current) {
          return;
        }

        const sanitizedResults = data.filter(
          (item) => typeof item.place_id === "number" && Boolean(item.lat) && Boolean(item.lon) && Boolean(item.display_name),
        );

        setResults(sanitizedResults);
      } catch (fetchError: unknown) {
        if (abortController.signal.aborted) {
          return;
        }

        console.error("Geocoding search failed:", fetchError);
        setResults([]);
        setError("Could not fetch locations. Try again.");
      } finally {
        if (requestId === searchRequestId.current) {
          setIsLoading(false);
        }
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      abortController.abort();
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (result: NominatimResult) => {
    const city = result.address?.city || result.address?.town || result.address?.village || result.address?.suburb || "";
    const state = result.address?.state || "";

    setLocation({
      lat: Number.parseFloat(result.lat),
      lng: Number.parseFloat(result.lon),
      city,
      state,
      locality: result.display_name,
    });

    setOpen(false);
    setQuery("");
    setResults([]);
    setError(null);
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
            <CommandInput placeholder="Type a city or area..." value={query} onValueChange={setQuery} />
            <CommandList>
              {query.trim().length < MIN_QUERY_LENGTH && <CommandEmpty>Type at least 3 characters.</CommandEmpty>}
              {query.trim().length >= MIN_QUERY_LENGTH && isLoading && <CommandEmpty>Searching locations...</CommandEmpty>}
              {query.trim().length >= MIN_QUERY_LENGTH && !isLoading && error && <CommandEmpty>{error}</CommandEmpty>}
              {query.trim().length >= MIN_QUERY_LENGTH && !isLoading && !error && results.length === 0 && (
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
                      <span className="font-bold text-sm">{getPrimaryLocationName(result)}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground line-clamp-1">{result.display_name}</span>
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
