import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-blur shadow-md">
      <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between">
        <p className="text-gray-700 text-sm">
          &copy; {new Date().getFullYear()} EVENTOO. All rights reserved.
        </p>
        <div className="flex items-center gap-4 mt-2 md:mt-0">
          <Link to="/privacy" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
            Privacy Policy
          </Link>
          <Link to="/terms" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
            Terms of Service
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 text-sm font-medium">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
