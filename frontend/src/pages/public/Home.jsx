import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const services = [
    {
      title: "Custom Furniture Manufacturing",
      desc: "Bespoke furniture tailored and engineered to fit your specific residential or commercial layout with absolute precision.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Kitchen Cabinets & Closets",
      desc: "Modern modular storage solutions combining sleek design, premium hardware, and smart organization utilities.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      gradient: "from-amber-600 to-amber-800",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "CNC Cutting & Decorative Panels",
      desc: "State-of-the-art computer-controlled carving and pattern engraving for high-end dividers and accent structures.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      ),
      gradient: "from-stone-600 to-amber-700",
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "TV Walls & Interior Finishing",
      desc: "Stunning feature wall panels, modern media units, and premium architectural wood details for modern rooms.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
        </svg>
      ),
      gradient: "from-orange-500 to-amber-600",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Office & Commercial Furniture",
      desc: "Premium executive desks, architectural reception counters, and conference tables designed for collaborative efficiency.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      gradient: "from-stone-700 to-stone-900",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400"
    },
    {
      title: "Woodworking Design Solutions",
      desc: "Turnkey rendering, accurate blueprint layout planning, and detail modeling before manufacturing commences.",
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      gradient: "from-amber-700 to-orange-700",
      image: "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=400"
    }
  ];

  const highlights = [
    {
      title: "Modern and Creative Designs",
      desc: "Our interior architects craft custom shapes and luxury accents designed to inspire."
    },
    {
      title: "Precision CNC Production",
      desc: "Utilizing modern CNC engraving machinery to ensure exact fit and perfect decorative cuts."
    },
    {
      title: "Quality Materials & Finishing",
      desc: "Carefully sourced hardwoods, multi-layer veneers, and long-lasting eco-friendly coatings."
    },
    {
      title: "Professional Project Handling",
      desc: "Seamless logistics, responsive client reporting, and expert on-site master installations."
    },
    {
      title: "Customized Solutions For All",
      desc: "Tailored to your specific design, dimensions, choice of material, and budget guidelines."
    }
  ];

  const galleryItems = [
    {
      title: "Architectural Kitchens",
      category: "Cabinetry",
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Contemporary TV Walls",
      category: "Lounge Interiors",
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Luxury Fitted Closets",
      category: "Master Bedrooms",
      image: "https://images.unsplash.com/photo-1558882224-cca166733360?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "CNC Geometric Wall Dividers",
      category: "Accents",
      image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Modern Coffee Tables",
      category: "Custom Furniture",
      image: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Commercial Reception Desks",
      category: "Offices & Cafés",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/20 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-stone-950">
      
      {/* Hero Section — refined with better hierarchy and visibility */}
      <section className="relative overflow-hidden min-h-screen pt-[88px] pb-12 md:pb-20">
        {/* Premium Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_80%_80%,rgba(251,146,60,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:32px_32px]" />
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-orange-500/8 rounded-full blur-[150px]" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-600/5 rounded-full blur-[100px]" />

        {/* Decorative Border Lines */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Content (Left) — enhanced with better typography hierarchy */}
            <div className="lg:col-span-7 space-y-8 text-left">
              {/* Live Status Badge */}
              <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-amber-500/10 border border-amber-500/20 rounded-full backdrop-blur-sm">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-[0.2em]">
                  Proudly Crafted in Addis Ababa
                </span>
              </div>

              {/* Main Headline — bold, clear, immediately readable */}
              <div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 dark:text-white leading-[1.05] tracking-tight">
                  <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-700 bg-clip-text text-transparent">
                    AddHomes Creatives
                  </span>
                  <br />
                  Premium Furniture & Interior Design
                </h1>
                <div className="w-24 h-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full mt-6" />
              </div>

              {/* Value Proposition — clear, compelling */}
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-medium">
                AddHomes Creatives is your trusted partner for custom furniture, fitted kitchens, 
                designer closets, and CNC woodwork — all crafted right here in Addis Ababa with 
                precision and passion.
              </p>

              {/* CTA Buttons — prominent, action-oriented */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/products">
                  <Button
                    variant="primary"
                    size="large"
                    className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 min-w-[220px] text-white font-bold tracking-wide text-base py-4 px-8 rounded-2xl"
                  >
                    Explore Our Designs
                    <svg className="w-5 h-5 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="secondary"
                    size="large"
                    className="border-2 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white hover:bg-amber-50 dark:hover:bg-slate-800 min-w-[200px] font-bold tracking-wide text-base py-4 px-8 rounded-2xl hover:border-amber-500/50"
                  >
                    Our Story
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators — redesigned for impact */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-950 dark:text-white">100%</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">Bespoke Design</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-950 dark:text-white">Addis</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">Ababa Hub</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-black text-slate-950 dark:text-white">CNC</div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-amber-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold tracking-wider uppercase">Carving Tech</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Hero Visuals (Right) — refined with better layering */}
            <div className="lg:col-span-5 relative mt-8 lg:mt-0">
              <div className="relative z-10">
                <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-3xl blur-2xl opacity-30" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-white/5">
                  <img 
                    src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=800" 
                    alt="Premium AddHomes Closet & TV Wall Finishing" 
                    className="w-full h-[520px] object-cover opacity-90"
                  />
                  
                  {/* Hero Overlay Card */}
                  <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md p-5 rounded-xl border border-white/20 dark:border-slate-800 shadow-xl flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">AddHomes Creatives</h4>
                      <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-0.5">Custom Kitchens & Wood Finishing</p>
                    </div>
                    <span className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full text-[10px] font-bold tracking-wider uppercase shadow-lg shadow-amber-500/30">
                      Premium
                    </span>
                  </div>
                </div>

                {/* Floating Badge 1 — Precision */}
                <div className="absolute -top-4 -left-4 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-md hidden sm:block">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900 dark:text-white">Precision Cut</div>
                      <div className="text-[11px] text-slate-500 font-medium mt-0.5">CNC Millimeter accuracy</div>
                    </div>
                  </div>
                </div>

                {/* Floating Badge 2 — Rating */}
                <div className="absolute top-1/3 -right-6 bg-white dark:bg-slate-900 p-4 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-800 backdrop-blur-md hidden sm:block">
                  <div className="flex items-center gap-2">
                    <div className="text-amber-500 text-sm">★★★★★</div>
                    <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Addis Ababa</span>
                  </div>
                  <div className="text-sm font-bold text-slate-950 dark:text-white mt-1">Excellent Finish</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Narrative Section - The AddHomes Philosophy */}
      <section className="py-20 bg-white/60 dark:bg-slate-900/40 backdrop-blur-md relative border-t border-b border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Image grid */}
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img 
                    src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=400" 
                    alt="AddHomes custom kitchen cabinets" 
                    className="rounded-2xl h-56 w-full object-cover shadow-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&q=80&w=400" 
                    alt="AddHomes CNC wall carvings" 
                    className="rounded-2xl h-72 w-full object-cover shadow-lg"
                  />
                </div>
                <div className="space-y-4 pt-10">
                  <img 
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=400" 
                    alt="AddHomes premium woodwork living room" 
                    className="rounded-2xl h-72 w-full object-cover shadow-lg"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&q=80&w=400" 
                    alt="AddHomes woodwork close-up" 
                    className="rounded-2xl h-56 w-full object-cover shadow-lg"
                  />
                </div>
              </div>
              
              {/* Floating tech badge */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-amber-600 to-orange-600 text-white px-6 py-4 rounded-xl shadow-2xl text-center max-w-[200px] border border-amber-400/30">
                <div className="text-2xl font-black">CNC + ART</div>
                <div className="text-[10px] tracking-widest font-bold uppercase mt-1">The Perfect Mix</div>
              </div>
            </div>

            {/* Right Text Philosophy */}
            <div className="space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-semibold uppercase tracking-wider">
                Precision Wooden Solutions
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Combining Traditional Artistry with <span className="text-amber-600 dark:text-amber-500">CNC Technology</span>
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-lg">
                At AddHomes Creatives, we combine traditional woodworking skills with modern CNC technology to deliver accurate, durable, and visually refined products.
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                From custom closets and kitchens to decorative wall panels and office furniture, every project is built with attention to detail and commitment to quality. Our goal is to transform ideas into functional and beautiful spaces through innovative design and professional execution.
              </p>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">✓</div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Custom Closet Fitting</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">✓</div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Premium Materials Only</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">✓</div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">CNC Geometric Grills</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">✓</div>
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Professional Setup Team</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Showcase */}
      <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
              What We Offer
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
              Our Specialized <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">Services</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              From custom closets and kitchen cabinets to decorative wall panels and office furniture — 
              everything we make is built with care and cut to perfection.
            </p>
          </div>

          {/* Grid of Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, i) => (
              <div 
                key={i} 
                className="group relative bg-white dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 overflow-hidden hover:-translate-y-2 transition-all duration-300 hover:shadow-xl hover:border-amber-500/30"
              >
                {/* Visual Image Banner with Gradient overlay */}
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent z-10" />
                  <img 
                    src={svc.image} 
                    alt={svc.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br ${svc.gradient} flex items-center justify-center shadow-lg z-20`}>
                    {svc.icon}
                  </div>
                </div>

                <div className="p-6 space-y-3 text-left">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Interactive Furniture Showcase / Gallery */}
      <section className="py-24 bg-white/30 dark:bg-slate-950/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
            <div className="text-left">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
                Our Portfolio
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mt-2">
                Spaces We've Transformed
              </h2>
            </div>
            <Link to="/products">
              <Button variant="primary" className="bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                View Full Catalog
              </Button>
            </Link>
          </div>

          {/* Grid of gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, i) => (
              <div 
                key={i} 
                className="group relative rounded-2xl overflow-hidden shadow-md h-80 bg-slate-900 cursor-pointer"
              >
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/10 to-transparent flex flex-col justify-end p-6 text-left">
                  <span className="text-[10px] text-amber-500 font-extrabold uppercase tracking-widest">
                    {item.category}
                  </span>
                  <h3 className="text-lg font-bold text-white mt-1 group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Why Choose AddHomes Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Highlights (Left) */}
            <div className="space-y-6 text-left">
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
                Why Choose Us
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
                Why Clients Love <span className="text-amber-600 dark:text-amber-500">AddHomes</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We use quality materials, honest pricing, and tailor every project to your space, style, and budget — so the result always feels like home.
              </p>

              <div className="space-y-4 pt-4">
                {highlights.map((hl, i) => (
                  <div 
                    key={i} 
                    className="flex gap-4 p-4 bg-white dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition duration-200"
                  >
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

            {/* Showcase Visual with floating card (Right) */}
            <div className="relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl blur-2xl opacity-20" />
              <div className="relative bg-slate-950 rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=80&w=800" 
                  alt="Precision wood carving CNC workspace" 
                  className="w-full h-[500px] object-cover opacity-85"
                />
                
                {/* floating operator status */}
                <div className="absolute top-6 left-6 bg-slate-950/80 backdrop-blur-md border border-slate-800 p-4 rounded-xl">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
                    <span className="text-[10px] text-slate-350 font-bold uppercase tracking-wider">CNC Router Online</span>
                  </div>
                </div>

                {/* Operator floating badge */}
                <div className="absolute bottom-6 right-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-6 rounded-xl border border-slate-100 dark:border-slate-800 max-w-[280px]">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-extrabold uppercase tracking-widest">
                    Precision Manufacturing
                  </div>
                  <div className="text-xl font-black text-slate-950 dark:text-white mt-1">
                    Accurate to 0.1mm
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2">
                    CNC technology eliminates assembly errors, guaranteeing durable drawers and joints.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Vision & Mission section */}
      <section className="py-24 bg-gradient-to-br from-amber-900 via-stone-900 to-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(245,158,11,0.1),transparent)]" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold text-amber-400 tracking-widest uppercase">
              Looking Forward
            </span>
            <h2 className="text-3xl md:text-5xl font-black">
              Our Vision & Mission
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Vision */}
            <div className="relative p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/40 text-left space-y-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                To become one of Ethiopia's leading creative furniture and interior brands by delivering innovative, high-quality, and reliable craftsmanship.
              </p>
            </div>

            {/* Mission */}
            <div className="relative p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-amber-500/40 text-left space-y-4">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                To provide functional, stylish, and durable furniture and interior solutions that enhance modern living and working spaces.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Contact Row / Showroom Address */}
      <section className="py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 space-y-4">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tracking-widest uppercase">
              Get in Touch
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white">
              We'd Love to Hear From You
            </h2>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl mx-auto text-sm">
              Have a question about pricing, materials, or a project idea? Reach out to our team 
              or come visit our showroom in Addis Ababa — we're happy to help.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Phone */}
            <a 
              href="tel:0905488848" 
              className="group p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800 hover:border-amber-500/40"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Showroom Tel</h3>
              <p className="text-amber-600 dark:text-amber-400 font-extrabold text-lg">0905488848</p>
              <p className="text-xs text-slate-400 mt-2">Tap to call our designers</p>
            </a>

            {/* Address */}
            <div className="p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800 hover:border-amber-500/40">
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Showroom Address</h3>
              <p className="text-slate-800 dark:text-slate-200 font-semibold text-sm">Shegole Mender-7</p>
              <p className="text-xs text-slate-400 mt-1">Addis Ababa, Ethiopia</p>
            </div>

            {/* Instagram */}
            <a 
              href="https://www.instagram.com/Addhomescreative" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800 hover:border-amber-500/40"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Instagram</h3>
              <p className="text-amber-600 dark:text-amber-400 font-extrabold">@Addhomescreative</p>
              <p className="text-xs text-slate-400 mt-2">Browse project photos</p>
            </a>

            {/* Tiktok */}
            <a 
              href="https://www.tiktok.com/@addhomes" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group p-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl text-center border border-slate-100 dark:border-slate-800 hover:border-amber-500/40"
            >
              <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-6 h-6 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">TikTok</h3>
              <p className="text-amber-600 dark:text-amber-400 font-extrabold">@addhomes</p>
              <p className="text-xs text-slate-400 mt-2">Watch design clips</p>
            </a>
          </div>

          {/* Bottom call to action panel */}
          <div className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 rounded-3xl p-10 md:p-14 text-white text-center shadow-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent)]" />
            <div className="relative z-10 max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl md:text-5xl font-black">
                Ready to Transform Your Space?
              </h2>
              <p className="text-amber-100 md:text-lg">
                Browse our collection of custom furniture and interior pieces, or track your ongoing order with live updates — all in one place.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <Link to="/products">
                  <Button variant="primary" size="large" className="bg-white text-amber-800 hover:bg-amber-50 font-extrabold w-full sm:w-auto px-8">
                    Browse Our Products
                  </Button>
                </Link>
                <Link to="/order-tracking">
                  <Button variant="secondary" size="large" className="border border-white/30 text-white hover:bg-white/10 font-extrabold w-full sm:w-auto px-8">
                    Track My Order
                  </Button>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default Home;