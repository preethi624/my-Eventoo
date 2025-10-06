import { useState} from "react";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";
import { motion } from "framer-motion";
import { 
  FaCalendar, 
  FaSearch, 
  FaMapMarkerAlt, 
 
  FaArrowRight,
  FaFire,
  FaStar,
  FaTicketAlt,
  FaShieldAlt,
  FaHeart,
  FaBolt,
  
  FaUsers,
  FaCheckCircle,
 
} from "react-icons/fa";

import UserNavbar from "../components/UseNavbar";

import { eventRepository } from "../../repositories/eventRepositories";
import Chatbot from "../components/Chatbot";

import SearchBar from "../components/SearchBar";
import RecommendationSticker from "../components/Recommendation";
import Footer from "../components/Footer";

const HomePage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const navigate = useNavigate();
  

 
  
  

  const handleSearch = async () => {
    const response = await eventRepository.findEvent(searchTerm);
    navigate(`/events/${response.result._id}`);
  };

  const handleRecommendationClick = () => {
    navigate("/recommended");
  };

  

  const handleBrowseAll = () => {
    navigate("/shows");
  };

  

  return (
    <div className="min-h-screen bg-black">
      <UserNavbar />
      <RecommendationSticker onClick={handleRecommendationClick} />

      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-black to-blue-900/40" />
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
            alt="Hero"
            className="w-full h-full object-cover opacity-30"
          />
        </motion.div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.03)_1px,transparent_1px)] bg-[size:72px_72px]"></div>

        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative h-full min-h-screen flex items-center justify-center px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8 max-w-6xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-5 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 text-white shadow-2xl hover:bg-white/10 transition-all"
            >
              <FaFire className="text-orange-400 text-lg animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                1000+ Events This Month • Trending Now
              </span>
            </motion.div>

            <h1 className="text-7xl md:text-8xl lg:text-[140px] font-black text-white tracking-tight leading-[0.9]">
              Experience
              <span className="block mt-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 animate-gradient-shift">
                Unforgettable
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-gradient-shift">
                Events
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
              Discover, book, and create memorable moments with the world's best event platform
            </p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="pt-6"
            >
              
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-wrap items-center justify-center gap-8 pt-8"
            >
              {[
                { icon: FaUsers, label: "500K+ Users", color: "from-blue-400 to-cyan-400" },
                { icon: FaStar, label: "4.9 Rating", color: "from-yellow-400 to-orange-400" },
                { icon: FaTicketAlt, label: "10K+ Events", color: "from-pink-400 to-purple-400" }
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-3 backdrop-blur-xl bg-white/5 px-6 py-3 rounded-full border border-white/10 hover:bg-white/10 transition-all group">
                  <stat.icon className={`text-xl bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                  <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        <Chatbot />

        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 cursor-pointer"
        >
          <div className="w-8 h-14 border-2 border-white/30 rounded-full flex items-start justify-center p-2 backdrop-blur-xl bg-white/5 hover:border-purple-400/50 transition-colors">
            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-4 bg-gradient-to-b from-purple-400 to-blue-400 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Featured Events */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-slate-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-400 text-sm font-semibold mb-4"
            >
              FEATURED EVENTS
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              Don't Miss Out
            </h2>
            <p className="text-xl text-gray-400">Experience these amazing events happening soon</p>
          </motion.div>

          

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBrowseAll}
              className="px-10 py-5 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/50 hover:bg-white/10 text-white rounded-xl font-bold text-lg transition-all inline-flex items-center gap-3 shadow-2xl"
            >
              Browse All  Upcoming Events
              <FaArrowRight />
            </motion.button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(120,119,198,0.15),transparent_70%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-sm font-semibold mb-4"
            >
              HOW IT WORKS
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              Simple. Fast. Amazing.
            </h2>
            <p className="text-xl text-gray-400">Book your perfect event in just 3 easy steps</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-20 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-pink-500/50"></div>
            
            {[
              {
                number: "01",
                icon: FaSearch,
                title: "Discover Events",
                description: "Browse thousands of curated events or use our smart search to find exactly what you're looking for.",
                color: "from-purple-500 to-purple-600"
              },
              {
                number: "02",
                icon: FaTicketAlt,
                title: "Book Instantly",
                description: "Select your seats, choose your tickets, and complete your booking in seconds with our streamlined checkout.",
                color: "from-blue-500 to-blue-600"
              },
              {
                number: "03",
                icon: FaBolt,
                title: "Enjoy the Show",
                description: "Get instant confirmation and digital tickets. Show up and create unforgettable memories.",
                color: "from-pink-500 to-pink-600"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-10">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                    <span className="text-2xl font-black text-white">{step.number}</span>
                  </div>
                </div>

                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 pt-14 border border-white/10 hover:border-purple-500/50 transition-all duration-300 h-full group-hover:scale-105">
                  <div className="text-center space-y-4">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${step.color}/20 rounded-2xl mb-4`}>
                      <step.icon className={`text-4xl bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

     

      {/* Testimonials */}
      <section className="py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-400 text-sm font-semibold mb-4"
            >
              TESTIMONIALS
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              Loved By Millions
            </h2>
            <p className="text-xl text-gray-400">See what our community has to say</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Music Enthusiast",
                image: "https://i.pravatar.cc/150?img=1",
                rating: 5,
                text: "This platform changed how I discover concerts! Found my favorite artists and booked tickets in minutes. The experience was seamless."
              },
              {
                name: "Michael Chen",
                role: "Event Organizer",
                image: "https://i.pravatar.cc/150?img=33",
                rating: 5,
                text: "As an organizer, this platform gave us incredible reach. Sold out our event in record time. The analytics are phenomenal!"
              },
              {
                name: "Emma Williams",
                role: "Art Lover",
                image: "https://i.pravatar.cc/150?img=5",
                rating: 5,
                text: "The curated recommendations are spot-on! I've discovered so many amazing events I wouldn't have found otherwise. Love it!"
              }
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full border-2 border-purple-500/50"
                  />
                  <div>
                    <h4 className="text-white font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-lg" />
                  ))}
                </div>

                <p className="text-gray-300 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Counter */}
      <section className="py-24 px-4 bg-gradient-to-b from-black via-slate-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(120,119,198,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(120,119,198,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500K+", label: "Happy Users", icon: FaUsers, color: "from-blue-400 to-cyan-400" },
              { value: "10K+", label: "Events Hosted", icon: FaCalendar, color: "from-purple-400 to-pink-400" },
              { value: "50+", label: "Cities Covered", icon: FaMapMarkerAlt, color: "from-green-400 to-emerald-400" },
              { value: "4.9/5", label: "User Rating", icon: FaStar, color: "from-yellow-400 to-orange-400" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center group"
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105">
                  <stat.icon className={`text-5xl mx-auto mb-4 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent group-hover:scale-110 transition-transform`} />
                  <div className={`text-5xl font-black mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                    {stat.value}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-4 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(120,119,198,0.1),transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="inline-block px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-sm font-semibold mb-4"
            >
              WHY CHOOSE US
            </motion.span>
            <h2 className="text-5xl md:text-7xl font-black text-white mb-4">
              Built For You
            </h2>
            <p className="text-xl text-gray-400">The ultimate platform for event experiences</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaTicketAlt,
                title: "Easy Booking",
                description: "Lightning-fast booking process with instant confirmation. Get your tickets in seconds.",
                gradient: "from-purple-500 to-purple-600",
                iconGradient: "from-purple-400 to-purple-600"
              },
              {
                icon: FaShieldAlt,
                title: "100% Secure",
                description: "Bank-level security encryption protects your data and payments at all times.",
                gradient: "from-blue-500 to-blue-600",
                iconGradient: "from-blue-400 to-blue-600"
              },
              {
                icon: FaHeart,
                title: "Curated Events",
                description: "Handpicked events tailored to your unique preferences for the best experience.",
                gradient: "from-pink-500 to-pink-600",
                iconGradient: "from-pink-400 to-pink-600"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:scale-105"
              >
                <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.gradient}/20 rounded-2xl mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all shadow-2xl`}>
                  <feature.icon className={`text-4xl bg-gradient-to-br ${feature.iconGradient} bg-clip-text text-transparent`} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 transition-all">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed text-lg group-hover:text-gray-300 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/50 via-black to-blue-900/50"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4wNSIvPjwvZz48L3N2Zz4=')] opacity-40"></div>
        
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-[120px]" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-3xl backdrop-blur-xl border border-yellow-400/30 mb-6">
              <FaBolt className="text-6xl text-yellow-400 animate-pulse" />
            </div>
            
            <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
              Never Miss an Event
            </h2>
            <p className="text-2xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Get personalized recommendations and exclusive early access
            </p>

            <div className="pt-6 max-w-3xl mx-auto">
              <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  onSearch={handleSearch}
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 pt-6">
              {[
                { icon: FaCheckCircle, text: "No spam, ever" },
                { icon: FaCheckCircle, text: "Unsubscribe anytime" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-300">
                  <item.icon className="text-green-400 text-xl" />
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
        }
      `}</style>
      <Footer/>
    </div>
    
  );
};

export default HomePage;