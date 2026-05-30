import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from '../../components/icons';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'News', path: '/news' },
    { name: 'Track Order', path: '/order-tracking' }
  ];

  const socialLinks = [
    { 
      name: 'Instagram', 
      href: 'https://www.instagram.com/Addhomescreative', 
      ariaLabel: 'Follow AddHomes on Instagram',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      )
    },
    { 
      name: 'TikTok', 
      href: 'https://www.tiktok.com/@addhomes', 
      ariaLabel: 'Follow AddHomes on TikTok',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31.02 2.61.1 3.9.24.08 1.53.63 3.09 1.75 4.22 1.13 1.13 2.69 1.68 4.22 1.76v3.9c-1.74-.06-3.41-.69-4.78-1.81-.13-.1-.25-.21-.37-.32v7.1c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9c.34 0 .68.02 1.01.06V6.9c-.33-.03-.67-.05-1.01-.05-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6V0h3.28z"/>
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-slate-950 text-slate-100 border-t border-slate-900 relative">
      {/* Subtle top amber gradient line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3 group">
              {/* Logo container with white background */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-xl blur-lg" />
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white p-1.5 shadow-lg shadow-amber-500/10 ring-2 ring-amber-500/20 group-hover:ring-amber-500/40 transition-all duration-300">
                  <img 
                    src="/src/assets/LOGO.png" 
                    alt="AddHomes Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse shadow-md" />
              </div>
              
              <div className="text-left">
                <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors duration-200">
                  AddHomes Creatives
                </h3>
                <p className="text-[10px] text-slate-450 font-semibold tracking-widest uppercase">
                  Premium Furniture & Interiors
                </p>
              </div>
            </div>
            
            <p className="text-slate-350 leading-relaxed max-w-md text-sm text-left">
              AddHomes Creatives is a modern furniture and interior solutions company based in Addis Ababa, 
              focused on quality craftsmanship, creative design, and precision CNC manufacturing. 
              We transform ideas into functional and beautiful spaces.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-left">
            <h4 className="text-sm font-bold tracking-widest text-white uppercase mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500" />
            </h4>
            <nav className="space-y-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-sm text-slate-350 hover:text-white transition-colors duration-200 group"
                >
                  <span className="relative">
                    {link.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-500 transition-all duration-200 group-hover:w-full" />
                  </span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Information */}
          <div className="text-left space-y-6">
            <h4 className="text-sm font-bold tracking-widest text-white uppercase mb-1 relative inline-block">
              Showroom Info
              <span className="absolute bottom-0 left-0 w-8 h-0.5 bg-amber-500" />
            </h4>
            <div className="space-y-4 pt-1">
              <div className="flex items-center gap-3 text-slate-350 group text-sm">
                <Phone className="w-4 h-4 text-amber-500 group-hover:scale-115 transition-transform" />
                <a href="tel:0905488848" className="hover:text-white transition-colors duration-200 font-medium">
                  0905488848
                </a>
              </div>
              <div className="flex items-start gap-3 text-slate-350 text-sm">
                <MapPin className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span>
                  Shegole Mender-7<br />
                  Addis Ababa, Ethiopia
                </span>
              </div>
              <div className="flex items-center gap-3 text-slate-350 text-sm">
                <Mail className="w-4 h-4 text-amber-500" />
                <a href="mailto:info@addhomescreative.com" className="hover:text-white transition-colors duration-200">
                  info@addhomescreative.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-900 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            
            {/* Copyright */}
            <div className="text-xs text-slate-500">
              © {currentYear} AddHomes Creatives. All rights reserved. Addis Ababa, Ethiopia.
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest hidden sm:block">Follow Us:</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.ariaLabel}
                    className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all duration-200 group relative overflow-hidden"
                  >
                    <div className="group-hover:scale-110 transition-transform duration-200 relative z-10">
                      {social.icon}
                    </div>
                    {/* Glowing background bubble on hover */}
                    <div className="absolute inset-0 bg-amber-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
