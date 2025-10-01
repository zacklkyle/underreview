import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info, Target, ListChecks } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SportOverview({ sport, overviewData }) {
  if (!overviewData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/70 backdrop-blur-sm border-gray-200 shadow-md">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-gray-800">About {sport}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 text-gray-700">
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-gray-800"><Info className="w-5 h-5 text-orange-500" />Description</h3>
            <p>{overviewData.description}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-gray-800"><Target className="w-5 h-5 text-orange-500" />Purpose</h3>
            <p>{overviewData.purpose}</p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2 text-gray-800"><ListChecks className="w-5 h-5 text-orange-500" />Key Facts</h3>
            <ul className="list-disc list-inside space-y-1">
              {overviewData.key_facts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}