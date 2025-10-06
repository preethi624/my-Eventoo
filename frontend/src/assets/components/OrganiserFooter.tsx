
import { Calendar, BarChart3, Mail, Phone, FileText, HelpCircle, Shield, Book, Zap, ArrowRight, Sparkles } from 'lucide-react';

export default function OrganiserFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-300 border-t border-slate-700/50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold text-white">Eventoo</span>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed text-sm">
              Empowering event organizers with powerful tools to create, manage, and grow successful events.
            </p>
            <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <Sparkles className="text-blue-400" size={18} />
              <span className="text-sm font-semibold text-blue-400">Organiser Dashboard</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Zap className="text-yellow-400" size={18} />
              Quick Actions
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/organiser/create-event" className="group flex items-center gap-2 hover:text-blue-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  Create New Event
                </a>
              </li>
              <li>
                <a href="/organiser/events" className="group flex items-center gap-2 hover:text-blue-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  My Events
                </a>
              </li>
              <li>
                <a href="/organiser/dashboard" className="group flex items-center gap-2 hover:text-blue-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/organiser/analytics" className="group flex items-center gap-2 hover:text-blue-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  Analytics
                </a>
              </li>
              <li>
                <a href="/organiser/earnings" className="group flex items-center gap-2 hover:text-blue-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-blue-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  Earnings Report
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Book className="text-purple-400" size={18} />
              Resources
            </h4>
            <ul className="space-y-3">
              <li>
                <a href="/organiser/help" className="group flex items-center gap-2 hover:text-purple-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  Help Center
                </a>
              </li>
              <li>
                <a href="/organiser/guides" className="group flex items-center gap-2 hover:text-purple-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  Organiser Guides
                </a>
              </li>
              <li>
                <a href="/organiser/best-practices" className="group flex items-center gap-2 hover:text-purple-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  Best Practices
                </a>
              </li>
              <li>
                <a href="/organiser/faqs" className="group flex items-center gap-2 hover:text-purple-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  FAQs
                </a>
              </li>
              <li>
                <a href="/api-docs" className="group flex items-center gap-2 hover:text-purple-400 transition-colors text-sm">
                  <div className="w-1 h-1 rounded-full bg-purple-400 opacity-0 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                  API Documentation
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <HelpCircle className="text-emerald-400" size={18} />
              Support
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-emerald-400" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email Support</p>
                  <a href="mailto:support@eventhub.com" className="text-sm text-gray-300 hover:text-emerald-400 transition-colors font-medium">
                    support@eventhub.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 bg-slate-700/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-blue-400" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Phone Support</p>
                  <a href="tel:+1234567890" className="text-sm text-gray-300 hover:text-blue-400 transition-colors font-medium">
                    +1 (234) 567-890
                  </a>
                </div>
              </li>
            </ul>

            <div className="mt-6 p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-white">24/7 Available</span>
              </div>
              <p className="text-xs text-gray-400">
                Priority support for organisers
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 p-6 bg-slate-800/50 rounded-2xl border border-slate-700/50">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Calendar className="text-blue-400" size={20} />
              <h5 className="text-2xl font-bold text-white">10K+</h5>
            </div>
            <p className="text-xs text-gray-400">Events Created</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <BarChart3 className="text-purple-400" size={20} />
              <h5 className="text-2xl font-bold text-white">98%</h5>
            </div>
            <p className="text-xs text-gray-400">Success Rate</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Zap className="text-yellow-400" size={20} />
              <h5 className="text-2xl font-bold text-white">50K+</h5>
            </div>
            <p className="text-xs text-gray-400">Active Organizers</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Shield className="text-emerald-400" size={20} />
              <h5 className="text-2xl font-bold text-white">100%</h5>
            </div>
            <p className="text-xs text-gray-400">Secure Platform</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <p>© {currentYear} EventHub Organiser Portal. All rights reserved.</p>
            </div>
            <div className="flex gap-6 text-sm flex-wrap justify-center">
              <a href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                <FileText size={14} />
                Terms of Service
              </a>
              <a href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                <Shield size={14} />
                Privacy Policy
              </a>
              <a href="/organiser-agreement" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                <FileText size={14} />
                Organiser Agreement
              </a>
            </div>
          </div>
        </div>

        {/* Quick Access Button */}
        <div className="mt-8 flex justify-center">
          <a 
            href="/organiser/create-event"
            className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center gap-3"
          >
            <Calendar size={20} />
            Create Your Next Event
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
}