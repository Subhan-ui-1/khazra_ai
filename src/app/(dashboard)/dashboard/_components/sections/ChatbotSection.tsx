'use client';

import { useState } from 'react';

export default function ChatbotSection() {
  const [inputValue, setInputValue] = useState('');

  const suggestions = [
    '🌳 What are carbon offset projects?',
    '⚡ What is Scope 2 emissions?',
    '🎯 What are SBTi targets?',
    '🏭 What are net-zero strategies?',
    '📊 How to measure carbon footprint?',
    '🔍 ESG reporting frameworks',
    '💡 Energy efficiency best practices',
    '🌿 Renewable energy options'
  ];

  const handleSend = () => {
    if (inputValue.trim()) {
      alert(`🤖 Processing your sustainability question: "${inputValue}"\n\nThis would connect to our AI advisory system for expert guidance.`);
      setInputValue('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const text = suggestion.replace(/^[^\w]+/, ''); // Remove emoji
    setInputValue(text);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-semibold text-green-800 mb-10">
        Sustainability expertise starts from here
      </h1>

      <div className="bg-white border border-green-100 rounded-xl p-5 mb-6 shadow-sm flex items-center gap-3">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask anything about sustainability, emissions, or ESG..."
          className="flex-1 border-none outline-none text-base text-green-800 bg-transparent"
        />
        <button
          onClick={handleSend}
          className="w-8 h-8 bg-green-800 text-white rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
        >
          →
        </button>
      </div>

      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="bg-white border border-green-100 text-green-800 px-4 py-2 rounded-full text-sm cursor-pointer transition-all duration-300 hover:bg-green-50 hover:-translate-y-1"
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className="bg-green-50 border border-green-800 rounded-lg p-4">
        <div className="font-semibold text-green-800 mb-2">
          💡 AI-Powered Sustainability Advisory
        </div>
        <div className="text-sm text-green-800 opacity-80">
          Get expert guidance on sustainability strategies, regulatory compliance, target setting, and emission reduction initiatives. 
          Our AI assistant has comprehensive knowledge of ISSB, GRI, TCFD, CDP, and SBTi frameworks.
        </div>
      </div>
    </div>
  );
} 