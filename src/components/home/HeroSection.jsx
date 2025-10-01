import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-20"></div>
      
      <div className="max-w-4xl mx-auto px-4 py-20 md:py-32 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            You're the Ref!
            <span className="block text-orange-400 mt-2">Make the Call</span>
          </h1>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Upload game clips, debate controversial calls, and learn the rules of your favorite sports. Join the community of sports enthusiasts.
          </p>
          <div className="flex justify-center">
            <Link to={createPageUrl("RulesSearch")}>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8 h-12 text-lg">
                <BookOpen className="w-5 h-5 mr-2" />
                Sports Rules Encyclopedia
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>);

}