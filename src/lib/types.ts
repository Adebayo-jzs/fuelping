export interface FuelReport {
  id: string;
  stationName: string;
  fuelType: "PMS" | "Diesel" | "Gas";
  price: number;
  reporter: string;
  timePosted: Date;
  distance: number;
  upvotes: number;
  downvotes: number;
  lat: number;
  lng: number;
  photo?: string;
}

export interface UserProfile {
  username: string;
  reportsCount: number;
  tipsEarned: number;
  trustScore: number;
}
