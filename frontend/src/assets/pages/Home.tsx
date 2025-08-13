import { useState, useEffect } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";

import type { FC } from "react";
import { motion } from "framer-motion";

import { FaCalendar, FaSearch, FaMapMarkerAlt, FaClock } from "react-icons/fa";

import UserNavbar from "../components/UseNavbar";
import type { IEventDTO } from "../../interfaces/IEvent";
import { eventRepository } from "../../repositories/eventRepositories";

import Chatbot from "../components/Chatbot";
import { categoryRepository } from "../../repositories/categoryRepository";
import SearchBar from "../components/SearchBar";

const HomePage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState<IEventDTO[]>([]);
  const navigate = useNavigate();
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>(
    []
  );

  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    fetchCategories();
    fetchEventsByCategory("Music");
    setSelectedCategory("Music");
  }, []);
  const fetchCategories = async () => {
    const response = await categoryRepository.getCategories();
    setCategories(response.cat);
  };
  const fetchEventsByCategory = async (category: string) => {
    const response = await eventRepository.fetchEventsByCategory(category);

    setEvents(response.result);
  };
  const handleEventClick = (id: string) => {
    navigate(`/events/${id}`);
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };
  const handleSearch = async () => {
    const response = await eventRepository.findEvent(searchTerm);

    navigate(`/events/${response.result._id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <UserNavbar />
      <section className="relative h-screen overflow-hidden">
        <motion.div
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80 mix-blend-multiply" />
          <img
            src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30"
            alt="Hero"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="relative h-full flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center space-y-8 max-w-4xl"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-tight">
              Experience
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                Unforgettable Events
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-200">
              Discover, Book, and Create Memorable Moments
            </p>

            {/* Search Bar with Animation */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <div className="relative w-full max-w-2xl group">
                <input
                  type="text"
                  placeholder="Search for events..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSearch();
                    }
                  }}
                  className="w-full px-6 py-4 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-lg bg-white/90 backdrop-blur-sm transition-all duration-300 group-hover:bg-white"
                />
                <FaSearch className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSearch}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full shadow-lg transition-all duration-300 whitespace-nowrap"
              >
                Explore Events
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
        <Chatbot />

        {/* Scroll Indicator */}
        <motion.div
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white"
        >
          <div className="w-6 h-10 border-2 border-white rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap justify-center gap-4"
          >
            {categories.map((category) => (
              <motion.button
                key={category._id}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedCategory(category.name);
                  fetchEventsByCategory(category.name);
                }}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category.name
                    ? "bg-black text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                } shadow-md`}
              >
                {category.name}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="relative">
              <img
                src={
                  event.images && event.images.length > 0
                    ? `http://localhost:3000/${event.images[0].replace(
                        "\\",
                        "/"
                      )}`
                    : "https://via.placeholder.com/300x200"
                }
                alt={event.title}
                className="w-full h-52 object-cover"
              />
              <span className="absolute top-3 right-3 bg-black text-white text-sm px-3 py-1 rounded-full">
                {event.category}
              </span>
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {event.title}
              </h2>
              <div className="text-gray-600 flex items-center mb-1">
                <FaCalendar className="mr-2 text-black" />
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div className="text-gray-600 flex items-center mb-1">
                <FaClock className="mr-2 text-black" />
                {event.time}
              </div>
              <div className="text-gray-600 flex items-center mb-2">
                <FaMapMarkerAlt className="mr-2 text-black" />
                {event.venue}
              </div>

              <div className="flex justify-between items-center mt-4">
                <div className="text-[#004d4d]-600 font-semibold text-lg">
                  ₹{event.ticketPrice}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-500 to-blue-500">
        <div className="max-w-4xl mx-auto text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
            />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
