// app/admin/[department]/page.tsx (Final, Most Robust Version)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdminPanel } from "@/components/adminPanel";
import { DepartmentId } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js"; // Import the Session type

export default function DepartmentAdminPage({ params }: { params: { department: string } }) {
  const router = useRouter();
  const departmentId = params.department as DepartmentId;

  // --- NEW STATE TO MANAGE THE ENTIRE PAGE LIFECYCLE ---
  const [session, setSession] = useState<Session | null>(null);
  const [currentToken, setCurrentToken] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This is the main effect that orchestrates everything sequentially.
  useEffect(() => {
    const setupPage = async () => {
      try {
        // --- STEP 1: ESTABLISH A VALID SESSION ---
        const { data: { session: activeSession }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw new Error(`Session Error: ${sessionError.message}`);

        let currentSession = activeSession;
        if (!currentSession) {
          const { data: { session: newSession }, error: signInError } = await supabase.auth.signInAnonymously();
          if (signInError) throw new Error(`Sign-in Error: ${signInError.message}`);
          if (!newSession) throw new Error("Failed to create a new anonymous session.");
          currentSession = newSession;
        }
        setSession(currentSession); // We have a valid session!

        // --- STEP 2: FETCH TOKEN DATA (only after session is confirmed) ---
        const { data: tokenData, error: tokenError } = await supabase
          .from('tokens')
          .select('current_token')
          .eq('department', departmentId)
          .single();
        
        if (tokenError) throw new Error(`Token Fetch Error: ${tokenError.message}`);
        setCurrentToken(tokenData.current_token);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    setupPage();
  }, [departmentId]);
  
  // Real-time listener (can stay the same)
  useEffect(() => {
    if (!session) return; // Don't subscribe until we have a session
    const channel = supabase.channel(`token-updates-for-${departmentId}`).on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tokens', filter: `department=eq.${departmentId}` }, (payload) => {
      setCurrentToken(payload.new.current_token);
    }).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [departmentId, session]); // Re-subscribe if the session were to change

  const handleUnlockAttempt = async (pin: string): Promise<boolean> => {
    const { data, error } = await supabase.functions.invoke('verify-pin', { body: { department: departmentId, pin } });
    return !error && data.success;
  };

  const handleTokenUpdate = async (newToken: number): Promise<void> => {
    // We are now 100% sure a valid session exists before this is called.
    const { error } = await supabase.functions.invoke('update-token', { body: { department: departmentId, token: newToken } });
    if (error) {
      const functionError = await error.context.json();
      throw new Error(functionError.error || "Failed to update token.");
    }
  };

  // --- RENDER LOGIC ---
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Initializing Secure Session...</div>;
  }

  if (error || currentToken === null) {
    return <div className="flex items-center justify-center min-h-screen text-red-500 p-4 text-center">{error || "Could not load token data."}</div>;
  }

  return (
    <AdminPanel
      departmentId={departmentId}
      currentToken={currentToken}
      onTokenUpdate={handleTokenUpdate}
      onUnlockAttempt={handleUnlockAttempt}
      onBack={() => router.push('/admin')}
    />
  );
}