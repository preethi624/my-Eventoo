import React from 'react';
import { Calendar, History, Sparkles } from 'lucide-react';

interface EventHistoryStickerProps {
  onClick: () => void;
}

const EventHistorySticker: React.FC<EventHistoryStickerProps> = ({ onClick }) => {
  return (
    <div className="fixed top-30 right-6 z-50">
      {/* Main Sticker Button */}
      <button
        onClick={onClick}
        className="group relative bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 
                   text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl 
                   transform hover:scale-105 transition-all duration-300 ease-in-out
                   animate-pulse hover:animate-none border-2 border-white/20"
      >
        {/* Sparkle Effect */}
        <div className="absolute -top-1 -right-1">
          <Sparkles className="w-5 h-5 text-yellow-300 animate-spin" />
        </div>
        
        {/* Content */}
        <div className="flex items-center gap-2">
          <History className="w-5 h-5" />
          <span className="font-bold text-sm">CompletedEvents</span>
          <Calendar className="w-4 h-4" />
        </div>
        
        {/* Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 
                        opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300"></div>
      </button>
      
      {/* Floating Tooltip */}
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 
                      bg-black text-white text-xs px-3 py-1 rounded-lg opacity-0 
                      group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap
                      before:content-[''] before:absolute before:-top-1 before:left-1/2 
                      before:transform before:-translate-x-1/2 before:border-l-4 
                      before:border-r-4 before:border-b-4 before:border-transparent 
                      before:border-b-black">
        View complete event history
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute -top-2 -left-2 w-3 h-3 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
      <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-blue-400 rounded-full animate-bounce delay-300"></div>
    </div>
  );
};

export default EventHistorySticker;
