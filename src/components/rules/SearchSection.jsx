
import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function SearchSection({ selectedSport, onSearch, isSearching, isRookieMode, onRookieModeChange }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && selectedSport) {
      onSearch(query);
    }
  };

  const suggestions = {
    NFL: ["What is a catch?", "What is pass interference?", "What is holding?"],
    NBA: ["What is traveling?", "What is a technical foul?", "What is goaltending?"],
    MLB: ["What is a balk?", "What is the infield fly rule?", "What is a check swing?"],
    NHL: ["What is icing?", "What is offsides?", "What is a major penalty?"],
    "College Football": ["What is targeting?", "What is a safety?", "What is intentional grounding?"],
    "Soccer": ["What is the offside rule?", "What is a handball?", "What is a direct vs. indirect free kick?"]
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 bg-blue-50 border border-blue-200 p-3 rounded-xl justify-center">
        <Switch
          id="rookie-mode"
          checked={isRookieMode}
          onCheckedChange={onRookieModeChange}
          disabled={!selectedSport || isSearching} />

        <Label htmlFor="rookie-mode" className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-semibold text-blue-800 text-base">Wifey Mode

        </Label>
        <p className="text-sm text-gray-600 hidden sm:block">- Get simplified, easy-to-understand answers. Now you can impress without really caring. </p>
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={selectedSport ? `Ask about ${selectedSport} rules...` : "Select a sport to search rules"}
            disabled={!selectedSport || isSearching}
            className="pl-12 pr-32 h-14 text-lg border-2 focus:border-orange-500 rounded-xl" />

          <Button
            type="submit"
            disabled={!selectedSport || !query.trim() || isSearching}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-orange-500 hover:bg-orange-600 rounded-lg h-10">

            {isSearching ?
            <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Searching...
              </> :

            "Search"
            }
          </Button>
        </div>
      </form>

      {selectedSport && suggestions[selectedSport] &&
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2">

          <p className="text-sm text-gray-500 font-medium">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions[selectedSport].map((suggestion, index) =>
          <button
            key={index}
            onClick={() => {
              setQuery(suggestion);
              onSearch(suggestion);
            }}
            disabled={isSearching}
            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm hover:border-orange-500 hover:text-orange-600 transition-colors duration-200 disabled:opacity-50">

                {suggestion}
              </button>
          )}
          </div>
        </motion.div>
      }
    </div>);

}