
import React, { useState, useEffect } from 'react';
import { InvokeLLM } from '@/api/integrations';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import SportCard from '../components/rules/SportCard';
import SearchSection from '../components/rules/SearchSection';
import RuleDisplay from '../components/rules/RuleDisplay';
import SportOverview from '../components/rules/SportOverview';

const SPORTS = ['NFL', 'NBA', 'MLB', 'NHL', 'College Football', 'Soccer'];

const SPORT_OVERVIEWS = {
  NFL: {
    description: "The National Football League is America's most popular professional football league, consisting of 32 teams divided equally between the National Football Conference and the American Football Conference.",
    purpose: "The objective is to score points by advancing the ball into the opposing team's end zone for a touchdown or kicking it through the opponent's goalposts for a field goal.",
    key_facts: [
      "A game is divided into four 15-minute quarters.",
      "Each team has 11 players on the field at a time.",
      "Teams get four downs (attempts) to advance the ball 10 yards."
    ]
  },
  NBA: {
    description: "The National Basketball Association is a professional basketball league in North America, composed of 30 teams. It is one of the major professional sports leagues in the United States and Canada.",
    purpose: "The goal is to score more points than the opponent by shooting a ball through a hoop 10 feet (3.048 m) high, which is defended by the opposing team.",
    key_facts: [
      "A game consists of four 12-minute quarters.",
      "Each team has five players on the court at a time.",
      "Shots are worth 2 or 3 points, and free throws are worth 1 point."
    ]
  },
  MLB: {
    description: "Major League Baseball is a professional baseball organization and the oldest of the major professional sports leagues in the United States and Canada.",
    purpose: "The objective is to score more runs than the opponent by hitting a ball with a bat and advancing counter-clockwise around a series of four bases.",
    key_facts: [
      "A game consists of 9 innings, with each team getting one turn at bat per inning.",
      "Each team has 9 players on the field.",
      "Three strikes result in an out; four balls result in a walk."
    ]
  },
  NHL: {
    description: "The National Hockey League is a professional ice hockey league in North America, currently comprising 32 teams. It is considered to be the premier professional ice hockey league in the world.",
    purpose: "The goal is to score goals by shooting a vulcanized rubber puck into the opponent's net, using a hockey stick.",
    key_facts: [
      "A game is divided into three 20-minute periods.",
      "Each team has six players on the ice at a time, including the goaltender.",
      "Penalties result in a player being sent to a penalty box for a set amount of time."
    ]
  },
  'College Football': {
    description: "College football is American football played by teams of student-athletes fielded by American universities, colleges, and military academies.",
    purpose: "Similar to professional football, the object is to score points by advancing the ball into the opposing team's end zone. Rules can vary slightly from the NFL.",
    key_facts: [
      "Games are divided into four 15-minute quarters.",
      "Overtime rules are significantly different from the NFL, involving alternating possessions from the 25-yard line.",
      "Player eligibility is governed by the NCAA."
    ]
  },
  Soccer: {
    description: "Association football, commonly known as soccer, is a team sport played with a ball between two teams of 11 players. It is the world's most popular sport.",
    purpose: "The objective is to score by getting the ball into the opposing goal. Players are not allowed to touch the ball with their hands or arms, except for the goalkeepers within their penalty area.",
    key_facts: [
      "A standard match consists of two halves of 45 minutes each.",
      "The offside rule is a key and often complex aspect of the game.",
      "A tied game may end in a draw, or proceed to extra time and/or a penalty shootout in knockout competitions."
    ]
  }
};

export default function RulesSearch() {
  const [selectedSport, setSelectedSport] = useState(null);
  const [currentQuery, setCurrentQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const [isRookieMode, setIsRookieMode] = useState(false);

  // Removed useEffect for fetching overview as data is now static

  // Removed fetchSportOverview function as data is now static

  const handleSearch = async (query) => {
    setIsSearching(true);
    setError(null);
    setCurrentQuery(query);
    setAnswer('');

    try {
      const rookiePrompt = `You are a sports rules expert. Explain the following rule for ${selectedSport} in very simple, beginner-friendly terms (like for a "rookie").

Question: ${query}

Keep the answer short and use a simple analogy if possible. Avoid jargon.`;

      const expertPrompt = `You are a sports rules expert. A user has asked about ${selectedSport} rules.

Question: ${query}

Please provide:
1. A clear, detailed explanation of the rule
2. Key points to remember
3. 2-3 concrete examples from real games (or realistic scenarios)
4. Any important exceptions or nuances

Format your response in a well-structured, easy-to-read way. Use markdown formatting for emphasis where helpful.`;
      
      const prompt = isRookieMode ? rookiePrompt : expertPrompt;

      const response = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false
      });

      setAnswer(response);
    } catch (err) {
      setError("Sorry, we couldn't fetch that rule. Please try again.");
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
            Sports Rules
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mt-2">
              Encyclopedia
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive guide to understanding the rules of your favorite sports
          </p>
        </div>

        {/* Sport Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center md:text-left">
            Select a Sport
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {SPORTS.map((sport) => (
              <SportCard
                key={sport}
                sport={sport}
                isSelected={selectedSport === sport}
                onClick={() => setSelectedSport(sport)}
              />
            ))}
          </div>
        </div>

        {/* Sport Overview & Search Section */}
        {selectedSport && (
          <div className="mb-12 space-y-8">
            <SportOverview sport={selectedSport} overviewData={SPORT_OVERVIEWS[selectedSport]} />
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-100">
              <SearchSection
                selectedSport={selectedSport}
                onSearch={handleSearch}
                isSearching={isSearching}
                isRookieMode={isRookieMode}
                onRookieModeChange={setIsRookieMode}
              />
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Results Display */}
        {answer && (
          <RuleDisplay
            query={currentQuery}
            answer={answer}
            sport={selectedSport}
          />
        )}

        {/* Empty State */}
        {!selectedSport && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">⚡</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              Ready to Learn?
            </h3>
            <p className="text-gray-500">
              Select a sport above to start exploring the rules
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
