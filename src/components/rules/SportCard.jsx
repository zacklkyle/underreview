import React from 'react';
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function SportCard({ sport, isSelected, onClick }) {
  const sportStyles = {
    NFL: {
      gradient: "from-blue-900 to-blue-700",
      icon: "🏈",
      color: "#013369"
    },
    NBA: {
      gradient: "from-orange-600 to-red-600",
      icon: "🏀",
      color: "#C8102E"
    },
    MLB: {
      gradient: "from-blue-600 to-blue-800",
      icon: "⚾",
      color: "#041E42"
    },
    NHL: {
      gradient: "from-slate-700 to-slate-900",
      icon: "🏒",
      color: "#111111"
    },
    "College Football": {
      gradient: "from-purple-700 to-indigo-800",
      icon: "🎓",
      color: "#4B0082"
    },
    "Soccer": {
      gradient: "from-green-600 to-teal-700",
      icon: "⚽",
      color: "#008000"
    }
  };

  const style = sportStyles[sport];

  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        onClick={onClick}
        className={`cursor-pointer overflow-hidden transition-all duration-300 ${
          isSelected 
            ? 'ring-4 ring-orange-500 shadow-2xl' 
            : 'hover:shadow-xl'
        }`}
      >
        <div className={`bg-gradient-to-br ${style.gradient} p-6 text-white relative`}>
          <div className="absolute top-2 right-2 text-4xl opacity-20">
            {style.icon}
          </div>
          <div className="relative z-10">
            <div className="text-5xl mb-3">{style.icon}</div>
            <h3 className="text-lg font-bold tracking-tight">{sport}</h3>
          </div>
        </div>
        {isSelected && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className="h-1 bg-orange-500"
          />
        )}
      </Card>
    </motion.div>
  );
}