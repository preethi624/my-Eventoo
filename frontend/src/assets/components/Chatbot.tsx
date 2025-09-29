import  { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaTimes, FaPaperPlane, FaUser } from 'react-icons/fa';

import { chatbotRepository } from '../../repositories/chatRepositories';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/stroe';
import type { CustomJwtPayload } from '../../interfaces/IUser';

interface Message {
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export interface ChatbotResponse {
  response: string;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! I'm your event assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
const user = useSelector((state: RootState) => state.auth.user as CustomJwtPayload );



  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
     
      const response=await chatbotRepository.createChat(inputMessage,user.id);
      if(!response||!response.response){
        throw new Error("Response not get")
      }

      setTimeout(() => {
        const botMessage: Message = {
          text: response.response.response,
          isBot: true,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 500);
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      const errorMessage: Message = {
        text: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 
                   rounded-full shadow-lg shadow-purple-500/30 flex items-center justify-center text-white z-50
                   hover:shadow-xl hover:shadow-purple-500/40 transition-shadow duration-300"
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <FaRobot className="text-2xl" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-3xl shadow-2xl shadow-purple-500/20 
                     overflow-hidden z-50 border border-purple-100"
          >
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <FaRobot className="text-white text-xl" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Event Assistant</h3>
                  <span className="text-xs text-white/70">
                    {isTyping ? 'Typing...' : 'Online'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors"
              >
                <FaTimes className="text-white" />
              </button>
            </div>

            <div className="p-6 h-[calc(100%-180px)] overflow-y-auto scroll-smooth">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'} mb-4`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.isBot
                        ? 'bg-gray-50 text-gray-800 rounded-tl-none'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-tr-none'
                    } shadow-sm`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      {message.isBot ? 
                        <FaRobot className="text-purple-500" size={12} /> : 
                        <FaUser className="text-white/80" size={12} />
                      }
                      <span className={`text-xs ${message.isBot ? 'text-gray-500' : 'text-white/80'}`}>
                        {message.timestamp.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 shadow-sm">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-purple-100">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 px-6 py-3 bg-gray-50 rounded-full focus:outline-none focus:ring-2 
                           focus:ring-purple-500/20 focus:bg-white transition-all duration-300"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full text-white
                           shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 
                           transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane className="text-lg" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbot;