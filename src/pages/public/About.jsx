import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const About = () => {
  const services = [
    {
      title: "Custom Furniture Manufacturing",
      desc: "Tailored luxury furniture designed and manufactured to perfectly fit your home or office space with exquisite finish.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-650"
    },
    {
      title: "Kitchen Cabinets & Closets",
      desc: "Modern, spacious, and premium quality cabinets and closets that optimize storage, elegance, and daily usability.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      gradient: "from-amber-600 to-amber-850"
    },
    {
      title: "CNC Cutting & Decorative Panels",
      desc: "Precision computer-controlled carving and cutting for intricate decorative wall patterns, grilles, and privacy screens.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      gradient: "from-stone-600 to-amber-700"
    },
    {
      title: "TV Walls & Interior Finishing",
      desc: "Complete luxury interior wood finishings, accent background walls, and bespoke floating media consoles.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      gradient: "from-orange-500 to-amber-600"
    },
    {
      title: "Office & Commercial Furniture",
      desc: "Ergonomic executive desks, modern reception counters, conference setups, and customized solutions.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-stone-700 to-stone-900"
    },
    {
      title: "Woodworking Design Solutions",
      desc: "Innovative 3D interior design renders, exact blueprints, and layout plans before launching manufacturing.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      gradient: "from-amber-700 to-orange-700"
    }
  ];

  const highlights = [
    {
      title: "Modern and Creative Designs",
      desc: "Our interior architects craft custom solutions that represent the absolute height of style, wood texture, and premium luxury."
    },
    {
      title: "Precision CNC Production",
      desc: "Using modern computer-controlled carving technology to guarantee millimeter-perfect woodwork joint alignments and engravings."
    },
    {
      title: "Quality Materials & Finishing",
      desc: "We pick premium, durable wood, multi-layered veneer boards, and long-lasting eco-friendly finishes to guarantee lifetime usage."
    },
    {
      title: "Professional Project Handling",
      desc: "From initial concept sketches to final on-site installation, our team delivers a seamless, reliable execution."
    },
    {
      title: "Customized Solutions For All",
      desc: "No space is the same. We construct bespoke modules customized specifically to your lifestyle, spacing, and budget."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950">
      
      {/* Premium Header */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-stone-900 to-slate-950 text-white py-24 md:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full">
            <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            <span className="text-xs font-bold tracking-wider uppercase text-amber-300">
              Crafting Spaces You'll Love
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white">
            About <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 bg-clip-text text-transparent">AddHomes Creatives</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            We're a furniture and interior design company from Addis Ababa that turns your ideas 
            into beautifully crafted, functional spaces — built to last and designed to inspire.
          </p>
        </div>
      </section>

      {/* Main Philosophy & Background */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Narrative */}
            <div className="space-y-6 text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Merging Traditional Woodworking with <span className="text-amber-600 dark:text-amber-500 font-bold">CNC Precision</span>
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                At AddHomes Creatives, we combine traditional woodworking skills with modern CNC technology to deliver accurate, durable, and visually refined products.
              </p>
              <p className="text-slate-600 dark:text-slate-450 leading-relaxed">
                From custom closets and kitchens to decorative wall panels and office furniture, every project is built with attention to detail and commitment to quality. Our goal is to transform ideas into functional and beautiful spaces through innovative design and professional execution.
              </p>

              {/* Vision and Mission Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                {/* Vision */}
                <div className="relative group p-6 bg-white dark:bg-slate-900/50 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Our Vision
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    To become one of Ethiopia’s leading creative furniture and interior brands by delivering innovative, high-quality, and reliable craftsmanship.
                  </p>
                </div>

                {/* Mission */}
                <div className="relative group p-6 bg-white dark:bg-slate-900/50 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 hover:border-orange-500/30 transition-all duration-300">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-600 rounded-t-2xl" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Our Mission
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    To provide functional, stylish, and durable furniture and interior solutions that enhance modern living and working spaces.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Showcase Image */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur-xl opacity-20 animate-pulse" />
              <div className="relative bg-slate-955 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" 
                  alt="Modern AddHomes Creatives Interior Showroom" 
                  className="w-full h-[460px] object-cover opacity-90 hover:scale-105 transition-transform duration-700"
                />
                
                {/* floating badge */}
                <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 max-w-[240px]">
                  <div className="text-2xl font-black bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                    Addis Ababa
                  </div>
                  <div className="text-[10px] font-bold text-slate-450 mt-1 uppercase tracking-widest">
                    Ethiopia's Leading Design Hub
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 bg-slate-50 dark:bg-slate-900/40 backdrop-blur-sm relative border-t border-b border-slate-100 dark:border-slate-900">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
              What We Do
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
              Our Specialized <span className="text-amber-600 dark:text-amber-500">Services</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Whether it's a cozy home closet or a full commercial office fit-out, we bring the same 
              level of care, skill, and precision to every single project.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <div 
                key={i} 
                className="group relative bg-white dark:bg-slate-800 rounded-2xl shadow-md p-8 border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 hover:-translate-y-2 transition-all duration-300 hover:shadow-lg"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center mb-6 shadow-lg shadow-amber-500/10 group-hover:scale-110 transition-transform`}>
                  {svc.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors text-left">
                  {svc.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-left">
                  {svc.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Images */}
            <div className="grid grid-cols-2 gap-4">
              <img 
                src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400" 
                alt="Woodworking rendering detail" 
                className="rounded-2xl h-64 w-full object-cover shadow-md hover:scale-98 transition duration-350"
              />
              <img 
                src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400" 
                alt="Cabinet production" 
                className="rounded-2xl h-64 w-full object-cover shadow-md mt-8 hover:scale-98 transition duration-355"
              />
            </div>

            {/* Right Accordion Highlights */}
            <div className="space-y-6 text-left">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
                Our Promise
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Why Choose <span className="text-amber-600 dark:text-amber-500">AddHomes Creatives</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">
                We put quality first — from the materials we source to the moment we hand over your finished space. 
                Every project is customized to fit your life, your style, and your budget.
              </p>

              <div className="space-y-4">
                {highlights.map((hl, i) => (
                  <div key={i} className="flex gap-4 p-4 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition duration-200 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-black">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{hl.title}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{hl.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Showroom Contacts */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(245,158,11,0.1),transparent)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-black">
              Let's Build Something <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Beautiful Together</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-sm">
              Have a project in mind? We'd love to hear about it. Call us, visit our showroom, or follow along on social media to see our latest work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone */}
            <a 
              href="tel:0905488848" 
              className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/50 hover:bg-white/10 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Showroom Tel</h3>
              <p className="text-amber-450 font-extrabold text-lg">0905488848</p>
              <p className="text-xs text-slate-500 mt-2">Tap to call our designers</p>
            </a>

            {/* Address */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl text-center">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-amber-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Showroom Address</h3>
              <p className="text-slate-200 font-semibold text-sm">Shegole Mender-7</p>
              <p className="text-xs text-slate-400 mt-1">Addis Ababa, Ethiopia</p>
            </div>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/Addhomescreative" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/50 hover:bg-white/10 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">Instagram</h3>
              <p className="text-amber-450 font-extrabold">@Addhomescreative</p>
              <p className="text-xs text-slate-500 mt-2">Follow our dynamic portfolio</p>
            </a>

            {/* Tiktok */}
            <a 
              href="https://www.tiktok.com/@addhomes" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/50 hover:bg-white/10 transition-all duration-300 text-center"
            >
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-amber-450" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold mb-2">TikTok</h3>
              <p className="text-amber-450 font-extrabold">@addhomes</p>
              <p className="text-xs text-slate-500 mt-2">Watch design & assembly clips</p>
            </a>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-center gap-6 mt-16 text-center">
            <Link to="/products">
              <Button 
                variant="primary" 
                size="large"
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 min-w-[200px] text-white font-extrabold"
              >
                Browse Our Catalog
              </Button>
            </Link>
            <Link to="/order-tracking">
              <Button 
                variant="secondary" 
                size="large"
                className="border border-white/20 text-white hover:bg-white/10 min-w-[200px] font-extrabold"
              >
                Track My Order
              </Button>
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;
