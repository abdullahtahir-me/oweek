const departments = [
  {
    id: "cs",
    abbreviation: "CIS",
    gradient: "from-slate-600 to-slate-700",
    currentToken: 1
  },
  {
    id: "ee",
    abbreviation: "EE", 
    gradient: "from-blue-600 to-blue-700",
    currentToken: 1
  },
  {
    id: "che",
    abbreviation: "CHE",
    gradient: "from-teal-600 to-teal-700",
    currentToken: 1
  },
  {
    id: "me",
    abbreviation: "ME",
    gradient: "from-gray-600 to-gray-700",
    currentToken: 1
  },
  {
    id: "phy",
    abbreviation: "PHY",
    gradient: "from-indigo-600 to-indigo-700",
    currentToken: 1
  },
  {
    id: "mme",
    abbreviation: "MME",
    gradient: "from-slate-700 to-slate-800",
    currentToken: 1
  }
];

interface DashboardProps {
  tokenData: Record<string, number>;
}

export function Dashboard({ tokenData }: DashboardProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-slate-100 p-8">
      {/* Professional Header */}
      <div className="text-center mb-12">
        <div className="mb-6">
          <h1 className="text-5xl font-bold text-slate-800 mb-2 tracking-wide">PIEAS</h1>
          <p className="text-lg text-slate-600 font-medium">Pakistan Institute of Engineering & Applied Sciences</p>
        </div>
        <div className="mb-4">
          <h2 className="text-4xl font-semibold text-slate-700 mb-2">Student Orientation</h2>
          <h3 className="text-3xl font-medium text-blue-700">NOW SERVING</h3>
        </div>
        <div className="w-32 h-1 bg-gradient-to-r from-blue-600 to-slate-600 mx-auto rounded-full"></div>
      </div>

      {/* Department Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => {
            const currentToken = tokenData[dept.id] || dept.currentToken;
            
            return (
              <div 
                key={dept.id} 
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${dept.gradient} p-8 shadow-xl transform hover:scale-102 transition-all duration-300 hover:shadow-2xl border border-white/20`}
              >
                {/* Subtle decorative elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/3 rounded-full -ml-8 -mb-8"></div>
                
                <div className="relative z-10 text-center text-white">
                  {/* Department Abbreviation */}
                  <div className="mb-6">
                    <span className="inline-block px-4 py-2 bg-white/15 backdrop-blur-sm rounded-lg text-xl font-semibold tracking-wider border border-white/10">
                      {dept.abbreviation}
                    </span>
                  </div>
                  
                  {/* Token Number - Main Focus */}
                  <div className="space-y-3">
                    <div className="text-7xl font-bold leading-none tracking-tight">
                      {currentToken<10 ? String(currentToken).padStart(2, '0'): String(currentToken)}
                    </div>
                    <div className="text-lg font-medium opacity-80 tracking-wide">
                      TOKEN
                    </div>
                  </div>
                </div>

                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center">
        <div className="inline-block bg-white/70 backdrop-blur-sm rounded-xl px-8 py-4 border border-gray-200/50 shadow-lg">
          <p className="text-slate-700 text-lg font-medium">
            Please wait for your token number to be called
          </p>
          <p className="text-slate-500 text-sm mt-2">
            Last updated: {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </div>
  );
}