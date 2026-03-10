import { useState } from "react";
import { FuelReport } from "@/lib/types";

const MOCK_REPORTS: FuelReport[] = [
  {
    id: "1",
    stationName: "Total Energies - Lekki",
    fuelType: "PMS",
    price: 617,
    reporter: "AdebolaNG",
    timePosted: new Date(Date.now() - 25 * 60 * 1000),
    distance: 0.8,
    upvotes: 12,
    downvotes: 1,
    lat: 6.4541,
    lng: 3.4725,
  },
  {
    id: "2",
    stationName: "NNPC Mega Station - Ikoyi",
    fuelType: "PMS",
    price: 590,
    reporter: "FuelHunter",
    timePosted: new Date(Date.now() - 45 * 60 * 1000),
    distance: 1.2,
    upvotes: 34,
    downvotes: 2,
    lat: 6.4481,
    lng: 3.4345,
  },
  {
    id: "3",
    stationName: "Mobil - Victoria Island",
    fuelType: "Diesel",
    price: 1250,
    reporter: "LagosDriver",
    timePosted: new Date(Date.now() - 80 * 60 * 1000),
    distance: 2.1,
    upvotes: 8,
    downvotes: 0,
    lat: 6.4281,
    lng: 3.4215,
  },
  {
    id: "4",
    stationName: "Conoil - Ajah",
    fuelType: "PMS",
    price: 630,
    reporter: "NaijaRider",
    timePosted: new Date(Date.now() - 100 * 60 * 1000),
    distance: 3.5,
    upvotes: 5,
    downvotes: 3,
    lat: 6.4641,
    lng: 3.5825,
  },
  {
    id: "5",
    stationName: "AP - Surulere",
    fuelType: "Gas",
    price: 980,
    reporter: "GasTracker",
    timePosted: new Date(Date.now() - 110 * 60 * 1000),
    distance: 4.8,
    upvotes: 3,
    downvotes: 1,
    lat: 6.5041,
    lng: 3.3525,
  },
];

export function useFuelReports() {
  const [reports, setReports] = useState<FuelReport[]>(MOCK_REPORTS);

  const addReport = (report: Omit<FuelReport, "id" | "timePosted" | "upvotes" | "downvotes" | "distance">) => {
    const newReport: FuelReport = {
      ...report,
      id: crypto.randomUUID(),
      timePosted: new Date(),
      upvotes: 0,
      downvotes: 0,
      distance: Math.round(Math.random() * 40 + 2) / 10,
    };
    setReports((prev) => [newReport, ...prev]);
  };

  const vote = (id: string, type: "up" | "down") => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, upvotes: r.upvotes + (type === "up" ? 1 : 0), downvotes: r.downvotes + (type === "down" ? 1 : 0) }
          : r
      )
    );
  };

  const activeReports = reports.filter(
    (r) => Date.now() - r.timePosted.getTime() < 2 * 60 * 60 * 1000
  );

  return { reports: activeReports, addReport, vote };
}
