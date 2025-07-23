import React from "react";
import { Link } from "react-router-dom";
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-pink-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <h2 className="text-xl font-bold text-pink-700">SheRox</h2>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empowering women through technology and innovation. Join our community 
              and discover your potential.
            </p>
            <div className="flex items-center space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-pink-600 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Home
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Contact
              </Link>
              <Link 
                to="/dashboard" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Support</h3>
            <div className="space-y-2">
              <Link 
                to="/help" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Help Center
              </Link>
              <Link 
                to="/privacy" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Terms of Service
              </Link>
              <Link 
                to="/faq" 
                className="block text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                FAQ
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-gray-900 font-semibold">Get in Touch</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail size={16} className="text-pink-600" />
                <span className="text-gray-600 text-sm">hello@sherox.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={16} className="text-pink-600" />
                <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin size={16} className="text-pink-600 mt-0.5" />
                <span className="text-gray-600 text-sm">
                  123 Innovation Street<br />
                  Tech City, TC 12345
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-2 md:space-y-0">
            <div className="flex items-center space-x-1 text-gray-600 text-sm">
              <span>© {currentYear} SheRox. Made with</span>
              <Heart size={14} className="text-pink-600 fill-current" />
              <span>for empowering women.</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link 
                to="/cookies" 
                className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Cookie Policy
              </Link>
              <Link 
                to="/accessibility" 
                className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Accessibility
              </Link>
              <Link 
                to="/sitemap" 
                className="text-gray-600 hover:text-pink-600 transition-colors text-sm"
              >
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;