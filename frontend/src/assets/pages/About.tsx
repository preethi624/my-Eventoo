import { useState } from 'react';
import { Calendar, Users, Award, Target, Zap, Heart, TrendingUp, CheckCircle, ArrowRight, Star, Play } from 'lucide-react';
import UserNavbar from '../components/UseNavbar';

export default function AboutUsPage() {
  const [activeTab, setActiveTab] = useState('mission');

  const stats = [
    { number: '10K+', label: 'Events Hosted', icon: Calendar },
    { number: '50K+', label: 'Happy Clients', icon: Users },
    { number: '25+', label: 'Awards Won', icon: Award },
    { number: '15+', label: 'Years Experience', icon: TrendingUp }
  ];

  const values = [
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for perfection in every event we create, ensuring unforgettable experiences.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Our team is passionate about bringing your vision to life with creativity and dedication.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'We work closely with clients, understanding their needs to deliver exceptional results.'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'Cutting-edge technology and creative solutions define our approach to event management.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      bio: '15+ years in event management'
    },
    {
      name: 'Michael Chen',
      role: 'Creative Director',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      bio: 'Award-winning event designer'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Operations Head',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
      bio: 'Expert in logistics & execution'
    },
    {
      name: 'David Park',
      role: 'Tech Lead',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=400&fit=crop',
      bio: 'Digital innovation specialist'
    }
  ];

  const milestones = [
    { year: '2010', title: 'Company Founded', description: 'Started with a vision to revolutionize event management' },
    { year: '2015', title: 'National Expansion', description: 'Expanded operations to 10+ major cities' },
    { year: '2020', title: 'Digital Transformation', description: 'Launched our cutting-edge event platform' },
    { year: '2025', title: 'Industry Leader', description: 'Recognized as top event management company' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <UserNavbar/>
      {/* Hero Section */}
      <div className="relative h-[70vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-purple-900/90 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1920&h=1080&fit=crop" 
          alt="Event venue" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 h-full flex items-center justify-center text-center px-6">
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-fade-in">
              Crafting Unforgettable Moments
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Where passion meets precision in event management excellence
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold transition-all hover:scale-105 flex items-center gap-2">
                Our Story <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 bg-white/10 backdrop-blur-md hover:bg-white/20 text-white rounded-full font-semibold transition-all border border-white/30 flex items-center gap-2">
                <Play size={20} /> Watch Video
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-30">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
              <stat.icon className="text-blue-600 mb-4" size={40} />
              <h3 className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission, Vision, Values Tabs */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          {['mission', 'vision', 'values'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 shadow-lg">
          {activeTab === 'mission' && (
            <div className="text-center max-w-3xl mx-auto">
              <Target className="text-blue-600 mx-auto mb-6" size={60} />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                To create extraordinary experiences that bring people together, celebrate milestones, and forge lasting memories through innovative event management solutions and unwavering dedication to excellence.
              </p>
            </div>
          )}

          {activeTab === 'vision' && (
            <div className="text-center max-w-3xl mx-auto">
              <Zap className="text-purple-600 mx-auto mb-6" size={60} />
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-xl text-gray-700 leading-relaxed">
                To be the world's most trusted and innovative event management platform, transforming how people plan, experience, and remember their most important moments through technology and creativity.
              </p>
            </div>
          )}

          {activeTab === 'values' && (
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <value.icon className="text-blue-600 mb-4" size={40} />
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Story Section with Image */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                Founded in 2010, EventHub began with a simple belief: every event deserves to be extraordinary. What started as a small team of passionate event planners has grown into a leading force in the event management industry.
              </p>
              <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                Through innovation, dedication, and an unwavering commitment to our clients, we've helped create thousands of unforgettable moments—from intimate gatherings to large-scale corporate events.
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={24} />
                  <span className="text-lg">Industry-leading expertise</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={24} />
                  <span className="text-lg">Cutting-edge technology platform</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="text-green-400" size={24} />
                  <span className="text-lg">Dedicated support team 24/7</span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform">
                <img 
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop" 
                  alt="Team collaboration" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 text-yellow-500 mb-2">
                  {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                </div>
                <p className="text-gray-900 font-semibold">4.9/5 Client Rating</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-16">Our Journey</h2>
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-600 to-purple-600"></div>
          <div className="space-y-12">
            {milestones.map((milestone, index) => (
              <div key={index} className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className={`w-1/2 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <span className="text-3xl font-bold text-blue-600">{milestone.year}</span>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </div>
                </div>
                <div className="w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The passionate people behind your perfect events</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  <div className="relative overflow-hidden h-80">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600"></div>
        <img 
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1920&h=600&fit=crop" 
          alt="Event celebration" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Create Magic?</h2>
          <p className="text-xl text-white/90 mb-8">
            Let's bring your vision to life. Start planning your perfect event today.
          </p>
          <button className="px-10 py-5 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 shadow-xl">
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}