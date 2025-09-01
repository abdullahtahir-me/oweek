"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Alert, AlertDescription } from "./ui/alert";
import { Lock, Unlock, ChevronRight } from "lucide-react";
import { departments, DepartmentId } from "@/lib/data"; // Import from your shared data file

interface DepartmentSelectorProps {
  onDepartmentSelect: (departmentId: string) => void;
}

export function DepartmentSelector({ onDepartmentSelect }: DepartmentSelectorProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentId | "">("");
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"select" | "pin">("select");

  const handleDepartmentClick = (deptId: DepartmentId) => {
    setSelectedDepartment(deptId);
    setStep("pin");
    setError("");
    setPinInput("");
  };

  const handlePinSubmit = () => {
    // Check if a department is selected before proceeding
    if (!selectedDepartment) return;

    const department = departments[selectedDepartment];
    if (pinInput === department.pin) {
      // On success, call the function passed from the parent page.
      // The parent page will handle the actual navigation.
      onDepartmentSelect(selectedDepartment);
    } else {
      setError("Incorrect PIN. Please try again.");
      setPinInput("");
    }
  };

  const handleBack = () => {
    setStep("select");
    setSelectedDepartment("");
    setPinInput("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-slate-100 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">PIEAS</h1>
          <p className="text-lg text-slate-600 font-medium mb-4">Pakistan Institute of Engineering & Applied Sciences</p>
          <h2 className="text-2xl font-semibold text-slate-700">Staff Access Portal</h2>
        </div>

        {/* Error Message */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        {step === "select" ? (
          /* Department Selection */
          <Card className="p-6 bg-white shadow-lg">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Select Your Department</h3>
              <p className="text-gray-600">Choose your department to access the token management system</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(Object.keys(departments) as DepartmentId[]).map((id) => {
                const dept = departments[id];
                return (
                  <button
                    key={id}
                    onClick={() => handleDepartmentClick(id)}
                    className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${dept.gradient} p-6 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-left group`}
                  >
                    <div className="relative z-10">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xl font-bold mb-1">{dept.abbr}</h4>
                          <p className="text-sm opacity-90">{dept.name}</p>
                        </div>
                        <ChevronRight className="h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 text-center">
              <Link href="/" className="inline-block px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors">
                Back to Dashboard
              </Link>
            </div>
          </Card>
        ) : (
          /* PIN Entry */
          selectedDepartment && (
            <Card className="p-6 bg-white shadow-lg max-w-md mx-auto">
              <div className="text-center mb-6">
                <div className={`inline-block p-4 rounded-xl bg-gradient-to-br ${departments[selectedDepartment].gradient} mb-4`}>
                  <Lock className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Enter Department PIN</h3>
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-600">Department:</p>
                  <p className="font-semibold text-slate-700">
                    {departments[selectedDepartment].abbr} - {departments[selectedDepartment].name}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <Input
                  type="password"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    setError("");
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handlePinSubmit()}
                  placeholder="Enter PIN"
                  className="text-center text-lg py-3"
                  autoFocus
                />
                <div className="flex gap-3">
                  <Button onClick={handleBack} variant="outline" className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handlePinSubmit} className="flex-1 bg-blue-600 hover:bg-blue-700" disabled={!pinInput}>
                    <Unlock className="h-4 w-4 mr-2" />
                    Access
                  </Button>
                </div>
              </div>
            </Card>
          )
        )}
      </div>
    </div>
  );
}