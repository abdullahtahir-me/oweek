// components/adminPanel.tsx (Final, Promise-Safe Version)

"use client"
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Lock, Unlock, Plus, Minus, Loader2 } from "lucide-react";
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
  const [isUpdating, setIsUpdating] = useState(false); // <-- ADD THIS NEW STATE

  const department = departments[departmentId];

  // Inactivity timer (no changes needed here)
  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      if (!isLocked) {
        inactivityTimer = setTimeout(() => {
          setIsLocked(true);
          setError("Panel locked due to 5 minutes of inactivity.");
        }, 300000);
      }
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    resetTimer();
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
    };
  }, [isLocked]);

  if (!department) return <div>Invalid Department</div>;

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

  // --- THIS IS THE CORRECTED PART ---

  // Make the increment function async
  const handleIncrement = async () => {
    if (isUpdating) return;

    setIsUpdating(true);
    setError("");
    try {
      // Directly await the onTokenUpdate function passed from the parent
      await onTokenUpdate(currentToken + 1);
      setError(""); // Clear any previous errors on success
    } catch (err: any) {
      // If the promise rejects, the catch block will run
      setError(err.message);
    }finally {
      // This block runs after the try/catch is complete, ensuring the spinner always stops
      setIsUpdating(false);
    }
  };

  // Make the decrement function async
  const handleDecrement = async () => {
    if (isUpdating || currentToken <= 0) return;

    setIsUpdating(true);
    setError("");
    if (currentToken > 0) {
      try {
        // Directly await the onTokenUpdate function
        await onTokenUpdate(currentToken - 1);
        setError("");
      } catch (err: any) {
        setError(err.message);
      }finally {
      setIsUpdating(false);
    }
    }
  };
  
  // --- END OF CORRECTED PART ---

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
            <div className="space-y-4">
              <h3 className="text-center font-semibold text-slate-700">Panel Locked</h3>
              <Input type="password" value={pinInput} onChange={(e) => setPinInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleUnlock()} placeholder="Enter PIN to Unlock" className="text-center text-lg" autoFocus />
              <Button onClick={handleUnlock} disabled={isSubmitting} className="w-full bg-blue-600 hover:bg-blue-700">
                <Unlock className="h-4 w-4 mr-2" /> {isSubmitting ? "Verifying..." : "Unlock"}
              </Button>
            </div>
          ) : (
            <div>
               <div className="flex gap-4 mb-6">
                <Button 
                  onClick={handleDecrement} 
                  // Disable the button if it's updating OR if the token is already at 0
                  disabled={isUpdating || currentToken <= 0} 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 py-6 text-xl"
                >
                  {isUpdating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Minus className="h-6 w-6" />
                  )}
                </Button>
                
                <Button 
                  onClick={handleIncrement} 
                  // Disable the button if an update is in progress
                  disabled={isUpdating} 
                  size="lg" 
                  className="flex-1 py-6 text-xl bg-green-600 hover:bg-green-700"
                >
                  {isUpdating ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    <Plus className="h-6 w-6" />
                  )}
                </Button>
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