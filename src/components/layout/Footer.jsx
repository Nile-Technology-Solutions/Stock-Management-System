import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from '../../components/icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Products', path: '/products' },
    { name: 'News', path: '/news' },
    { name: 'Track Order', path: '/order-tracking' }
  ];

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, href: '#', ariaLabel: 'Follow us on LinkedIn' },
    { name: 'Twitter', icon: Twitter, href: '#', ariaLabel: 'Follow us on Twitter' },
    { name: 'GitHub', icon: Github, href: '#', ariaLabel: 'View our GitHub' }
  ];

  return (
    <footer className="bg-slate-900 text-slate-100 border-t border-slate-800 relative">
      {/* Subtle top gradient for smooth transition */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Company Description */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">SMS Nile Tech</h3>
              <p className="text-slate-300 leading-relaxed max-w-md">
                A modern stock and production management system built for efficiency and growth. 
                Delivering premium furniture solutions with precision and reliability.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Quick Links</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-slate-300 hover:text-white transition-colors duration-200 group"
                >
                  <span className="relative">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-200 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300 group">
                <Mail className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors duration-200" />
                <a 
                  href="mailto:info@sms-niletech.com" 
                  className="hover:text-white transition-colors duration-200"
                >
                  info@sms-niletech.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            
            {/* Copyright */}
            <div className="text-sm text-slate-400">
              © {currentYear} Nile Tech. All rights reserved.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400 hidden sm:block">Follow us:</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      aria-label={social.ariaLabel}
                      className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all duration-200 group relative overflow-hidden"
                    >
                      <IconComponent className="w-4 h-4 group-hover:scale-110 transition-transform duration-200 relative z-10" />
                      {/* Subtle glow effect on hover */}
                      <div className="absolute inset-0 bg-cyan-400/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
