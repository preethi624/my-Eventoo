
import { Calendar, MapPin, Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowRight } from 'lucide-react';

export default function ModernFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to get updates on upcoming events and exclusive offers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg focus:outline-none focus:border-blue-500 text-white placeholder-gray-500 w-full md:w-80"
              />
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2 whitespace-nowrap">
                Subscribe <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-blue-500" size={32} />
              <span className="text-2xl font-bold text-white">Eventoo</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Creating memorable experiences through exceptional event management. Your vision, our expertise.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-800 hover:bg-red-600 rounded-lg flex items-center justify-center transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Browse Events
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Create Event
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                My Bookings
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Venues
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Event Gallery
              </a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Help Center
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                FAQs
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Terms of Service
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Privacy Policy
              </a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors flex items-center gap-2 group">
                <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all"></span>
                Refund Policy
              </a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-400">123 Event Street, Business District, City 12345</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="text-blue-500 flex-shrink-0" size={20} />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-blue-400 transition-colors">
                  +1 (234) 567-890
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="text-blue-500 flex-shrink-0" size={20} />
                <a href="mailto:info@eventhub.com" className="text-gray-400 hover:text-blue-400 transition-colors">
                  info@eventhub.com
                </a>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-slate-800 rounded-lg border border-slate-700">
              <p className="text-sm text-gray-400">
                <span className="text-blue-400 font-semibold">24/7 Support</span><br />
                We're here to help anytime
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {currentYear} EventHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Sitemap</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Accessibility</a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Cookie Settings</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}