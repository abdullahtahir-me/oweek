// components/departmentSelector.tsx (The NEW, SIMPLIFIED version)
"use client";

import Link from "next/link";
import { Card } from "./ui/card";
import { ChevronRight } from "lucide-react";
import { departments, DepartmentId } from "@/lib/data"; // Using your secure data.ts file

export function DepartmentSelector() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-slate-100 p-6 flex items-center justify-center">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">PIEAS</h1>
          <p className="text-lg text-slate-600 font-medium mb-4">Pakistan Institute of Engineering & Applied Sciences</p>
          <h2 className="text-2xl font-semibold text-slate-700">Staff Access Portal</h2>
        </div>

        {/* Department Selection */}
        <Card className="p-6 bg-white shadow-lg">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Select Your Department</h3>
            <p className="text-gray-600">Choose your department to access the token management system.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Loop through departments and create a simple Link for each */}
            {(Object.keys(departments) as DepartmentId[]).map((id) => {
              const dept = departments[id];
              return (
                <Link
                  key={id}
                  href={`/admin/${id}`}
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
                </Link>
              );
            })}
          </div>

          {/* Back to Dashboard Link */}
          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="inline-block px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Back to Main Dashboard
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}