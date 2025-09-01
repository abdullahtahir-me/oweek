// components/adminPanel.tsx

"use client"
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Lock, Unlock, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { departments, DepartmentId } from "@/lib/data";

interface AdminPanelProps {
  departmentId: DepartmentId;
  currentToken: number;
  onTokenUpdate: (newToken: number) => Promise<void>;
  onUnlockAttempt: (pin: string) => Promise<boolean>;
  onBack: () => void;
}

export function AdminPanel({ departmentId, currentToken, onTokenUpdate, onUnlockAttempt, onBack }: AdminPanelProps) {
  const [isLocked, setIsLocked] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const department = departments[departmentId];

  // Effect for the auto-lock inactivity timer
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (!isLocked) { // Only run the timer if the panel is unlocked
        inactivityTimer = setTimeout(() => {
          setIsLocked(true);
          setError("Panel locked due to 5 minutes of inactivity.");
        }, 300000); // 5 minutes (300,000 ms)
      }
    };

    // Listen for any user activity to reset the timer
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer(); // Start the timer

    // Cleanup function to remove listeners when the component is unmounted
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [isLocked]);

  if (!department) return <div>Invalid Department</div>; // Basic safety check

  // Function to handle the unlock button click
  const handleUnlock = async () => {
    setIsSubmitting(true);
    setError("");
    const success = await onUnlockAttempt(pinInput);
    if (success) {
      setIsLocked(false);
      setPinInput("");
    } else {
      setError("Incorrect PIN. Please try again.");
      setPinInput("");
    }
    setIsSubmitting(false);
  };

  // A wrapper function to call the update prop and handle errors
  const handleUpdate = async (newToken: number) => {
    try {
      await onTokenUpdate(newToken);
      setError(""); // Clear previous errors on success
    } catch (err: any) {
      setError(err.message); // Display error message if the update fails
    }
  };

  const handleIncrement = () => handleUpdate(currentToken + 1);
  const handleDecrement = () => { if (currentToken > 0) handleUpdate(currentToken - 1); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-slate-100 p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">PIEAS Admin Panel</h1>
          <div className="bg-white rounded-xl p-4 shadow-md border mt-4">
            <h2 className="text-xl font-semibold text-blue-700">{department.name} ({department.abbr})</h2>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6"><AlertDescription>{error}</AlertDescription></Alert>
        )}

        <Card className="p-6 bg-white shadow-lg">
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 uppercase tracking-wider">Current Token</p>
            <div className="text-6xl font-bold text-slate-800">{String(currentToken).padStart(3, '0')}</div>
          </div>

          {isLocked ? (
            // --- LOCKED VIEW ---
            <div className="space-y-4">
              <h3 className="text-center font-semibold text-slate-700">Panel Locked</h3>
              <Input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleUnlock()} placeholder="Enter PIN to Unlock" className="text-center text-lg" autoFocus />
              <Button onClick={handleUnlock} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                <Unlock className="h-4 w-4 mr-2" /> {isSubmitting ? "Verifying..." : "Unlock"}
              </Button>
            </div>
          ) : (
            // --- UNLOCKED VIEW ---
            <div>
              <div className="flex gap-4 mb-6">
                <Button onClick={handleDecrement} disabled={currentToken <= 0} variant="outline" size="lg" className="flex-1 py-6 text-xl"><Minus className="h-6 w-6" /></Button>
                <Button onClick={handleIncrement} size="lg" className="flex-1 py-6 text-xl bg-green-600 hover:bg-green-700"><Plus className="h-6 w-6" /></Button>
              </div>
              <div className="mt-6 pt-4 border-t">
                <Button onClick={() => setIsLocked(true)} variant="outline" size="sm" className="w-full text-gray-600"><Lock className="h-4 w-4 mr-2" /> Lock Panel</Button>
              </div>
            </div>
          )}
        </Card>

        <div className="mt-6 text-center">
          <button onClick={onBack} className="text-sm text-slate-600 hover:underline">
            Back to Department Selection
          </button>
        </div>
      </div>
    </div>
  );
}