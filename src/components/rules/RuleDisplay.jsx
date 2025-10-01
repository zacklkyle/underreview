import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BookOpen, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function RuleDisplay({ query, answer, sport }) {
  if (!answer) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="border-2 border-gray-100 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-orange-600 mb-1">{sport}</div>
              <CardTitle className="text-2xl font-bold text-gray-900 leading-tight">
                {query}
              </CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          {/* Text Explanation */}
          <div className="prose prose-lg max-w-none">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900 m-0">Rule Explanation</h3>
              </div>
              <ReactMarkdown className="text-gray-800 leading-relaxed">
                {answer}
              </ReactMarkdown>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}