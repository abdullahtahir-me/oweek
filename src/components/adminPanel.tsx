"use client"
import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Lock, Plus, Minus, Hash } from "lucide-react";

const departments = {
  cs: { name: "Computer & Information Sciences", abbr: "CS" },
  ee: { name: "Electrical Engineering", abbr: "EE" },
  ce: { name: "Chemical Engineering", abbr: "CE" },
  me: { name: "Mechanical Engineering", abbr: "ME" },
  cv: { name: "Civil Engineering", abbr: "CV" },
  ms: { name: "Materials Science", abbr: "MS" }
};

interface AdminPanelProps {
  departmentId: string;
  currentToken: number;
  onTokenUpdate: (newToken: number) => void;
  onBack: () => void;
}

export function AdminPanel({ departmentId, currentToken, onTokenUpdate, onBack }: AdminPanelProps) {
  const [customToken, setCustomToken] = useState("");
  const [error, setError] = useState("");

  const department = departments[departmentId as keyof typeof departments];

  if (!department) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <Card className="p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Invalid Department</h2>
          <p className="text-gray-600">The department ID "{departmentId}" is not recognized.</p>
        </Card>
      </div>
    );
  }

  const handleIncrement = () => {
    onTokenUpdate(currentToken + 1);
  };

  const handleDecrement = () => {
    if (currentToken > 1) {
      onTokenUpdate(currentToken - 1);
    }
  };

  const handleCustomUpdate = () => {
    const newToken = parseInt(customToken);
    if (isNaN(newToken) || newToken < 1) {
      setError("Please enter a valid token number.");
      return;
    }
    onTokenUpdate(newToken);
    setCustomToken("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-slate-100 p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">PIEAS</h1>
          <p className="text-sm text-slate-600 font-medium mb-4">Admin Panel</p>
          
          {/* Department Info */}
          <div className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
            <p className="text-sm text-gray-500">Department</p>
            <h2 className="text-xl font-semibold text-blue-700">{department.abbr}</h2>
            <p className="text-sm text-gray-600">{department.name}</p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Token Controls */}
        <Card className="p-6 bg-white shadow-lg">
          {/* Current Token Display */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-2 uppercase tracking-wider">Current Token</p>
            <div className="text-6xl font-bold text-slate-800 mb-2">
              {String(currentToken).padStart(3, '0')}
            </div>
          </div>

          {/* Plus/Minus Controls */}
          <div className="flex gap-4 mb-6">
            <Button 
              onClick={handleDecrement}
              disabled={currentToken <= 1}
              variant="outline"
              size="lg"
              className="flex-1 py-6 text-xl"
            >
              <Minus className="h-6 w-6" />
            </Button>
            
            <Button 
              onClick={handleIncrement}
              size="lg"
              className="flex-1 py-6 text-xl bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          {/* Custom Token Input */}
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={customToken}
                onChange={(e) => {
                  setCustomToken(e.target.value);
                  setError("");
                }}
                placeholder="Set custom token"
                className="text-center"
              />
              <Button 
                onClick={handleCustomUpdate}
                disabled={!customToken}
                variant="outline"
                className="px-4"
              >
                <Hash className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Button 
              onClick={onBack}
              variant="outline"
              size="sm"
              className="w-full text-gray-600"
            >
              <Lock className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <a 
            href="#" 
            className="inline-block px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}