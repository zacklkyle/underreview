
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, BookOpen, Gavel } from "lucide-react";

export default function Layout({ children }) {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Gavel className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 text-xl font-bold capitalize">Under Review</h1>
                <p className="text-gray-500 text-sm">Because every call is up for debate.</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              <Link
                to={createPageUrl("Home")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive(createPageUrl("Home")) ?
                "bg-orange-100 text-orange-700" :
                "text-gray-600 hover:bg-gray-100"}`
                }>

                <Home className="w-5 h-5" />
                <span className="hidden md:inline">Home</span>
              </Link>
              <Link
                to={createPageUrl("RulesSearch")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isActive(createPageUrl("RulesSearch")) ?
                "bg-orange-100 text-orange-700" :
                "text-gray-600 hover:bg-gray-100"}`
                }>

                <BookOpen className="w-5 h-5" />
                <span className="hidden md:inline">Sports Rules</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>);

}
