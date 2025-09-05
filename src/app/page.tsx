// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Dashboard } from "@/components/homepage"; // Assuming this is the correct path
import { supabase } from "@/lib/supabase";
import { UserStar } from "lucide-react";


export default function DashboardPage() {
  const [tokenData, setTokenData] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState("");



  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString());
    update();
    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // 1. Fetch the initial state of all tokens when the page loads
    const fetchInitialTokens = async () => {
      const { data, error } = await supabase
        .from("tokens")
        .select("department, current_token");

      if (error) {
        console.error("Error fetching tokens:", error);
        setIsLoading(false);
        return;
      }

      // Transform the data array into the object format your Dashboard component needs
      const formattedData = data.reduce((acc, token) => {
        acc[token.department] = token.current_token;
        return acc;
      }, {} as { [key: string]: number });

      setTokenData(formattedData);
      setIsLoading(false);
    };

    fetchInitialTokens();

    // 2. Set up the real-time subscription to listen for any updates
    const channel = supabase
      .channel("realtime-tokens") // Give your channel a unique name
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "tokens" },
        (payload) => {
          // This function runs automatically whenever a token is updated
          const updatedToken = payload.new as {
            department: string;
            current_token: number;
          };

          // Update the local state to instantly reflect the change on the screen
          setTokenData((prevTokenData) => ({
            ...prevTokenData,
            [updatedToken.department]: updatedToken.current_token,
          }));
        }
      )
      .subscribe();

    // 3. Cleanup: Unsubscribe from the channel when the component is no longer on screen
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // The empty array ensures this runs only once when the component mounts



  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="relative">
      <Dashboard tokenData={tokenData} />

      {/* Navigation Helper */}
      <div className="flex items-center fixed top-8 right-8 space-x-4 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg sm:p-4 max-w-xs sm:border border-gray-200">
        <h2 className="max-sm:hidden text-3xl font-semibold">
          {time}
        </h2>
        <Link
          href="/admin"
          className="block p-3 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors font-medium"
        >
          <UserStar />
        </Link>
      </div>
    </div>
  );
}
