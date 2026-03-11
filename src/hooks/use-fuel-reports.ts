import { useState, useEffect } from "react";
import { FuelReport } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "./use-location";
import { toast } from "sonner";

export function useFuelReports() {
  const [reports, setReports] = useState<FuelReport[]>([]);
  const [loading, setLoading] = useState(true);
  const { location } = useLocation();

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("fuel_reports")
        .select(`
          *,
          profiles:user_id (username)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      let userVotes: Record<string, "up" | "down"> = {};
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        const { data: votesData } = await supabase
          .from("fuel_report_votes")
          .select("report_id, vote_type")
          .eq("user_id", userData.user.id);
        
        if (votesData) {
          userVotes = votesData.reduce((acc: any, curr: any) => {
            acc[curr.report_id] = curr.vote_type;
            return acc;
          }, {});
        }
      }

      const formattedReports: FuelReport[] = data.map((report: any) => ({
        id: report.id,
        stationName: report.station_name,
        fuelType: report.fuel_type as "PMS" | "Diesel" | "Gas",
        price: report.price,
        reporter: report.profiles?.username || "Anonymous",
        timePosted: new Date(report.created_at),
        distance: calculateDistance(location?.lat || 6.45, location?.lng || 3.47, report.lat, report.lng),
        upvotes: report.upvotes,
        downvotes: report.downvotes,
        lat: report.lat,
        lng: report.lng,
        photo: report.photo_url,
        userVote: userVotes[report.id],
        locality: report.locality,
        state: report.state,
      }));

      setReports(formattedReports);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load fuel reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [location]);

  const addReport = async (report: Omit<FuelReport, "id" | "timePosted" | "upvotes" | "downvotes" | "distance" | "reporter">) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Please log in to post a report");
        return;
      }

      const { error } = await supabase.from("fuel_reports").insert({
        user_id: userData.user.id,
        station_name: report.stationName,
        fuel_type: report.fuelType,
        price: report.price,
        lat: report.lat,
        lng: report.lng,
        photo_url: report.photo,
        locality: report.locality,
        state: report.state,
      });

      if (error) throw error;

      toast.success("Report posted successfully!");
      fetchReports();
    } catch (error: any) {
      console.error("Error adding report:", error);
      toast.error(error.message || "Failed to post report");
    }
  };

  const vote = async (id: string, type: "up" | "down") => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        toast.error("Please log in to vote");
        return;
      }

      const { error } = await supabase.from("fuel_report_votes").upsert({
        report_id: id,
        user_id: userData.user.id,
        vote_type: type,
      }, { onConflict: 'user_id,report_id' });

      if (error) throw error;

      // In production, you'd use a database function to update counts
      // For now, we'll refetch to show updated data
      fetchReports();
    } catch (error: any) {
      console.error("Error voting:", error);
      toast.error("Failed to register vote");
    }
  };

  return { reports, addReport, vote, loading, refresh: fetchReports };
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return Math.round(d * 10) / 10;
}

function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
