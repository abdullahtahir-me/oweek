"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/adminPanel";
import { initialTokenData, departments, DepartmentId } from "@/lib/data";

// This is a Dynamic Page Component in Next.js.
// It automatically receives `params` containing the dynamic segments from the URL.
// For a URL like `/admin/cs`, params will be { department: 'cs' }.
export default function DepartmentAdminPage({ params }: { params: { department: string } }) {
  const router = useRouter();
  const departmentId = params.department as DepartmentId;

  // This page's state is simple: it only needs to know the token for ONE department.
  const [currentToken, setCurrentToken] = useState<number | null>(null);

  // This effect runs when the page loads to get the initial token value.
  // In a real application, this is where you would fetch data from Supabase for this specific department.
  useEffect(() => {
    // Check if the departmentId from the URL is a valid one
    if (departments[departmentId]) {
      const initialToken = initialTokenData[departmentId];
      setCurrentToken(initialToken);
    }
    // If the departmentId is invalid, you could redirect or show an error.
    // The AdminPanel component already has a check for this, which is good.
  }, [departmentId]); // The effect re-runs if the departmentId changes.

  // This function is passed to the AdminPanel.
  // It's responsible for updating the state and, in the future, calling your backend API.
  const handleTokenUpdate = async (newToken: number) => {
    setCurrentToken(newToken);
    
    // --- FUTURE API CALL ---
    // This is where you would send the update to your server.
    // console.log(`Updating database: Set token for ${departmentId} to ${newToken}`);
    // try {
    //   const response = await fetch('/api/token', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({
    //       department: departmentId,
    //       token: newToken,
    //       pin: '...the pin could be re-validated here if needed...'
    //     })
    //   });
    //   if (!response.ok) {
    //     // Handle error, maybe revert the state or show a notification
    //     console.error("Failed to update token");
    //   }
    // } catch (error) {
    //   console.error("API call failed", error);
    // }
  };

  // This function is passed to the AdminPanel for its "Logout" button.
  // It uses the Next.js router to navigate back to the department selection screen.
  const handleBackToSelector = () => {
    router.push('/admin');
  };

  // We only render the AdminPanel if the current token has been loaded.
  // This prevents the panel from briefly showing a token of 0.
  if (currentToken === null) {
    // You can render a loading spinner here for a better user experience
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <AdminPanel
      departmentId={departmentId}
      currentToken={currentToken}
      onTokenUpdate={handleTokenUpdate}
      onBack={handleBackToSelector} // Pass the navigation function to the component
    />
  );
}