/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Mail, Shield, Zap, Wallet, Globe, TrendingUp, Users, ChevronDown, User, Phone, MapPin, Search } from 'lucide-react';
import { countries } from './countries';

interface FormData {
  name: string;
  email: string;
  phone: string;
  location: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    location: '',
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Country dropdown state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCountries = countries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setSearchQuery('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (isDropdownOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isDropdownOpen]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isModalOpen]);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isModalOpen]);

  // Auto-close modal after success
  useEffect(() => {
    if (submitted && isModalOpen) {
      const timer = setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [submitted, isModalOpen]);

  const openModal = () => {
    setIsModalOpen(true);
    setSubmitted(false);
    setFormErrors({});
    setError('');
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    setError('');
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Please enter a valid name';
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[\+]?[\d\s\-\(\)]{7,20}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!formData.location) {
      errors.location = 'Please select your country';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', phone: '', location: '' });
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060208] text-white font-body selection:bg-purple-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-12 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <img 
            src="/logo.png" 
            alt="Mansu Logo" 
            className="w-9 h-9 rounded-xl object-cover"
            referrerPolicy="no-referrer"
          />
          <span className="text-lg font-bold tracking-tight">Mansu</span>
        </div>
        {/* <div className="hidden md:flex gap-10 text-[13px] font-medium tracking-wide text-white/40">
          <a href="#about" className="hover:text-white transition-colors duration-300">About</a>
          <a href="#features" className="hover:text-white transition-colors duration-300">Features</a>
          <a href="#showcase" className="hover:text-white transition-colors duration-300">Showcase</a>
          <a href="#waitlist" className="hover:text-white transition-colors duration-300">Waitlist</a>
        </div> */}
        <button 
          onClick={openModal}
          className="px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] font-semibold uppercase tracking-[0.15em] hover:bg-purple-500 hover:border-purple-500 transition-all duration-500"
        >
          Join Waitlist
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 z-0 oveflow-hidden">
          <div className="w-full h-full animate-pulse-slow">
            <img 
              src="/hero-backg.webp" 
              alt="Neon Background" 
              className="w-full h-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#060208] via-[#060208]/40 to-[#060208]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(139,92,246,0.08),transparent_70%)]" />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-purple-500/20 bg-purple-500/[0.06] text-purple-300 text-[11px] font-medium tracking-[0.2em] uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              The Future of African Finance
            </span> */}
           <h1 className="font-display text-[clamp(3.2rem,8vw,6.5rem)] uppercase tracking-[-0.02em] md:tracking-[-0.04em] leading-[0.9] mb-8">
  Ease is <br />
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600">
    Coming
  </span>
</h1>
            {/* <p className="text-base md:text-lg text-white/45 max-w-xl mx-auto mb-14 font-light leading-[1.7]">
              We make buying and selling crypto safer, cheaper, and more enjoyable for millions of Africans. One app, every move.
            </p> */}
          </motion.div>

          {/* Hero CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              onClick={openModal}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-10 py-4 rounded-full font-semibold text-[13px] uppercase tracking-[0.12em] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105 transition-all duration-500"
            >
              Join The Waitlist
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        {/* <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-5 h-5 text-white/15" />
        </motion.div> */}
      </section>

      {/* Stats Bar */}
      {/* <section className="relative py-20 px-6 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { value: '1M+', label: 'Waitlist Users', icon: Users },
              { value: '150+', label: 'Countries', icon: Globe },
              { value: '0.1%', label: 'Transaction Fees', icon: TrendingUp },
              { value: '∞', label: 'Possibilities', icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-500/[0.08] border border-purple-500/[0.1] flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-500/20 transition-colors duration-500">
                  <stat.icon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="font-display text-3xl md:text-4xl tracking-tight mb-1">{stat.value}</div>
                <div className="text-[11px] uppercase tracking-[0.2em] text-white/30 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* ===== COMMENTED OUT SECTIONS ===== */}

      {/* About Section - commented out */}
      {false && (
      <section id="about" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="text-[11px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-4 block">About Mansu</span>
              <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] leading-[0.9] mb-8">
                One App.<br />
                <span className="text-white/40">Every Move.</span>
              </h2>
              <p className="text-base text-white/40 mb-10 leading-[1.8] font-light max-w-md">
                Mansu is designed for the modern African. Whether you're making big transfers or managing your daily wallet, we provide the infrastructure that just works.
              </p>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-500/5 border border-purple-500/10 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-sm tracking-tight">Fast Transfers</h4>
                  <p className="text-[13px] text-white/30 leading-relaxed font-light">Instant cross-border moves with zero hassle.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-fuchsia-400" />
                  </div>
                  <h4 className="font-semibold text-sm tracking-tight">Secure Wallets</h4>
                  <p className="text-[13px] text-white/30 leading-relaxed font-light">Bank-grade encryption for all your assets.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-violet-500/20 to-violet-500/5 border border-violet-500/10 flex items-center justify-center">
                    <Wallet className="w-5 h-5 text-violet-400" />
                  </div>
                  <h4 className="font-semibold text-sm tracking-tight">Multi-Currency</h4>
                  <p className="text-[13px] text-white/30 leading-relaxed font-light">Hold and manage multiple currencies effortlessly.</p>
                </div>
                <div className="space-y-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 border border-pink-500/10 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-pink-400" />
                  </div>
                  <h4 className="font-semibold text-sm tracking-tight">Global Reach</h4>
                  <p className="text-[13px] text-white/30 leading-relaxed font-light">Send money anywhere, to anyone, anytime.</p>
                </div>
              </div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative group"
            >
              <div className="absolute -inset-8 bg-gradient-to-r from-purple-500/15 via-fuchsia-500/10 to-purple-500/15 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.06] shadow-[0_0_80px_rgba(0,0,0,0.5)]">
                <img 
                  src="/about.png" 
                  alt="Mansu App Showcase" 
                  className="w-full"
                  referrerPolicy="no-referrer"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      )}

      {/* Features Section - commented out */}
      {false && (
      <section id="features" className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.04),transparent_60%)]" />
        <div className="max-w-7xl mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-4 block">Features</span>
            <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em] leading-[0.9] mb-6">
              Built for<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400">Africa</span>
            </h2>
            <p className="text-base text-white/35 max-w-md mx-auto font-light leading-[1.7]">
              Every feature is crafted with the unique needs of African users in mind.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Instant P2P Transfers',
                description: 'Send crypto to anyone instantly. No banks, no delays, no middlemen. Just pure, fast value transfer.',
                icon: Zap,
                gradient: 'from-purple-500/20 to-violet-500/5',
                border: 'hover:border-purple-500/30',
                iconColor: 'text-purple-400',
              },
              {
                title: 'Military-Grade Security',
                description: 'Your assets are protected with multi-layer encryption, biometric auth, and cold-storage infrastructure.',
                icon: Shield,
                gradient: 'from-fuchsia-500/20 to-pink-500/5',
                border: 'hover:border-fuchsia-500/30',
                iconColor: 'text-fuchsia-400',
              },
              {
                title: 'Smart Wallet Management',
                description: 'Track spending, set limits, and manage multiple wallets from a single beautiful dashboard.',
                icon: Wallet,
                gradient: 'from-violet-500/20 to-purple-500/5',
                border: 'hover:border-violet-500/30',
                iconColor: 'text-violet-400',
              },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className={`group p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/[0.06] ${feature.border} transition-all duration-500 hover:bg-white/[0.03]`}
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/[0.06] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />
                </div>
                <h3 className="text-lg font-semibold tracking-tight mb-3">{feature.title}</h3>
                <p className="text-[13px] text-white/30 leading-[1.8] font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Image Showcase - commented out */}
      {false && (
      <section id="showcase" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-[11px] uppercase tracking-[0.3em] text-purple-400 font-semibold mb-4 block">Showcase</span>
            <h2 className="font-display text-5xl md:text-7xl tracking-[-0.03em]">
              See It In Action
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: '/payment-exp.png', alt: 'Payment Experience', label: 'Payments', fit: 'object-cover' },
              { src: '/feature.png', alt: 'Feature Overview', label: 'Features', fit: 'object-contain' },
              { src: '/mobile-exp.png', alt: 'Mobile Experience', label: 'Mobile', fit: 'object-cover' },
            ].map((img, i) => (
              <motion.div
                key={img.label}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.7 }}
                className="group relative h-[420px] rounded-3xl overflow-hidden border border-white/[0.06] hover:border-purple-500/20 transition-all duration-700"
              >
                <img 
                  src={img.src} 
                  alt={img.alt} 
                  className={`absolute inset-0 w-full h-full ${img.fit} opacity-70 group-hover:opacity-95 group-hover:scale-105 transition-all duration-700`}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#060208] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-purple-300/70 font-medium">{img.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* CTA Section - commented out */}
      {false && (
      <section className="py-32 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.06),transparent_60%)]" />
        <div className="max-w-3xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-5xl md:text-8xl tracking-[-0.03em] leading-[0.85] mb-8">
              Ready For<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-purple-600">Ease?</span>
            </h2>
            <p className="text-base text-white/35 max-w-md mx-auto mb-12 font-light leading-[1.7]">
              Join thousands of Africans already on the waitlist. Be the first to experience the future of finance.
            </p>
            <button 
              onClick={() => document.getElementById('waitlist')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-10 py-4 rounded-full font-semibold text-[13px] uppercase tracking-[0.12em] hover:shadow-[0_0_40px_rgba(168,85,247,0.4)] hover:scale-105 transition-all duration-500"
            >
              Join The Waitlist
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>
      )}

      {/* Footer - commented out */}
      {false && (
      <footer className="py-16 px-6 border-t border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <img 
                  src="/logo.png" 
                  alt="Mansu Logo" 
                  className="w-8 h-8 rounded-lg object-cover"
                  referrerPolicy="no-referrer"
                />
                <span className="text-lg font-bold tracking-tight">Mansu</span>
              </div>
              <p className="text-[13px] text-white/25 font-light max-w-xs leading-relaxed">
                The future of easy transfers and big wallets in Africa. Ease is coming.
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-8 md:gap-16">
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-semibold">Product</span>
                <div className="flex flex-col gap-2.5">
                  <a href="#about" className="text-[13px] text-white/35 hover:text-white transition-colors font-light">About</a>
                  <a href="#features" className="text-[13px] text-white/35 hover:text-white transition-colors font-light">Features</a>
                  <a href="#waitlist" className="text-[13px] text-white/35 hover:text-white transition-colors font-light">Waitlist</a>
                </div>
              </div>
              <div className="space-y-4">
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/20 font-semibold">Social</span>
                <div className="flex flex-col gap-2.5">
                  <a href="#" className="text-[13px] text-white/35 hover:text-white transition-colors font-light">Twitter</a>
                  <a href="#" className="text-[13px] text-white/35 hover:text-white transition-colors font-light">Instagram</a>
                  <a href="#" className="text-[13px] text-white/35 hover:text-white transition-colors font-light">LinkedIn</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[11px] tracking-[0.15em] text-white/15 font-light">
              © 2026 Mansu. All rights reserved.
            </p>
            <p className="text-[11px] tracking-[0.15em] text-white/15 font-light">
              Designed for Africa. Built for the world.
            </p>
          </div>
        </div>
      </footer>
      )}

      {/* Waitlist Modal Overlay */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 sm:px-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-xl" />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute -top-12 right-0 text-white/40 hover:text-white text-sm font-light tracking-wide transition-colors duration-300 flex items-center gap-2"
              >
                Press ESC or click outside
              </button>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="modal-form"
                    onSubmit={handleSubmit}
                    className="relative group"
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 via-fuchsia-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-60" />
                    <div className="relative p-6 sm:p-8 bg-[#0d0a14]/95 backdrop-blur-2xl rounded-2xl border border-white/[0.1] shadow-[0_0_80px_rgba(139,92,246,0.15)] space-y-4">
                      
                      {/* Modal Header */}
                      <div className="text-center mb-2">
                        <h2 className="font-display text-2xl uppercase tracking-tight mb-1">Join the Waitlist</h2>
                        <p className="text-xs text-white/35 font-light">Be the first to experience ease.</p>
                      </div>

                      {/* Full Name */}
                      <div>
                        <div className={`flex items-center px-4 gap-3 rounded-xl bg-white/[0.04] border transition-colors duration-300 ${formErrors.name ? 'border-red-500/50' : 'border-white/[0.06] focus-within:border-purple-500/40'}`}>
                          <User className="w-4 h-4 text-white/25 flex-shrink-0" />
                          <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={isLoading}
                            className="bg-transparent border-none outline-none w-full text-sm py-3 placeholder:text-white/20 font-light disabled:opacity-50"
                          />
                        </div>
                        {formErrors.name && (
                          <p className="mt-1 text-xs text-red-400/80 text-left pl-1">{formErrors.name}</p>
                        )}
                      </div>

                      {/* Email */}
                      <div>
                        <div className={`flex items-center px-4 gap-3 rounded-xl bg-white/[0.04] border transition-colors duration-300 ${formErrors.email ? 'border-red-500/50' : 'border-white/[0.06] focus-within:border-purple-500/40'}`}>
                          <Mail className="w-4 h-4 text-white/25 flex-shrink-0" />
                          <input
                            type="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            disabled={isLoading}
                            className="bg-transparent border-none outline-none w-full text-sm py-3 placeholder:text-white/20 font-light disabled:opacity-50"
                          />
                        </div>
                        {formErrors.email && (
                          <p className="mt-1 text-xs text-red-400/80 text-left pl-1">{formErrors.email}</p>
                        )}
                      </div>

                      {/* Phone Number */}
                      <div>
                        <div className={`flex items-center px-4 gap-3 rounded-xl bg-white/[0.04] border transition-colors duration-300 ${formErrors.phone ? 'border-red-500/50' : 'border-white/[0.06] focus-within:border-purple-500/40'}`}>
                          <Phone className="w-4 h-4 text-white/25 flex-shrink-0" />
                          <input
                            type="tel"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            disabled={isLoading}
                            className="bg-transparent border-none outline-none w-full text-sm py-3 placeholder:text-white/20 font-light disabled:opacity-50"
                          />
                        </div>
                        {formErrors.phone && (
                          <p className="mt-1 text-xs text-red-400/80 text-left pl-1">{formErrors.phone}</p>
                        )}
                      </div>

                      {/* Location Dropdown */}
                      <div ref={dropdownRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          disabled={isLoading}
                          className={`w-full flex items-center px-4 gap-3 rounded-xl bg-white/[0.04] border transition-colors duration-300 cursor-pointer disabled:opacity-50 ${formErrors.location ? 'border-red-500/50' : 'border-white/[0.06] hover:border-purple-500/40'}`}
                        >
                          <MapPin className="w-4 h-4 text-white/25 flex-shrink-0" />
                          <span className={`flex-1 text-left text-sm py-3 font-light ${formData.location ? 'text-white' : 'text-white/20'}`}>
                            {formData.location || 'Select Country'}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-white/25 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a1025] backdrop-blur-2xl border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
                              <Search className="w-3.5 h-3.5 text-white/30" />
                              <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Search countries..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent border-none outline-none w-full text-xs placeholder:text-white/20 font-light text-white"
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto scrollbar-thin">
                              {filteredCountries.length === 0 ? (
                                <div className="px-4 py-3 text-xs text-white/30 text-center">No countries found</div>
                              ) : (
                                filteredCountries.map((country) => (
                                  <button
                                    key={country}
                                    type="button"
                                    onClick={() => {
                                      handleInputChange('location', country);
                                      setIsDropdownOpen(false);
                                      setSearchQuery('');
                                    }}
                                    className={`w-full text-left px-4 py-2.5 text-sm font-light transition-colors duration-200 hover:bg-purple-500/20 ${
                                      formData.location === country ? 'text-purple-400 bg-purple-500/10' : 'text-white/60'
                                    }`}
                                  >
                                    {country}
                                  </button>
                                ))
                              )}
                            </div>
                          </div>
                        )}
                        {formErrors.location && (
                          <p className="mt-1 text-xs text-red-400/80 text-left pl-1">{formErrors.location}</p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white px-8 py-3.5 rounded-xl font-semibold text-[12px] uppercase tracking-[0.15em] hover:shadow-[0_0_30px_rgba(168,85,247,0.4)] transition-all duration-500 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                      >
                        {isLoading ? (
                          <>
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Joining...
                          </>
                        ) : (
                          <>
                            Join Waitlist
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* General error */}
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-sm text-red-400/90 text-center font-light"
                      >
                        {error}
                      </motion.p>
                    )}
                  </motion.form>
                ) : (
                  <motion.div
                    key="modal-success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-10 bg-[#0d0a14]/95 backdrop-blur-2xl rounded-2xl border border-purple-500/30 text-center shadow-[0_0_80px_rgba(139,92,246,0.15)]"
                  >
                    <CheckCircle2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
                    <p className="text-sm text-white/45 font-light">We'll notify you as soon as we launch. Get ready for ease.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes pulse-slow-mobile {
          0%, 100% { transform: translateX(-25px) scale(1.15); opacity: 0.5; }
          50% { transform: translateX(-25px) scale(1.18); opacity: 0.7; }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.1); opacity: 0.5; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }

        .animate-pulse-slow {
          animation: pulse-slow-mobile 10s ease-in-out infinite;
          transform-origin: 50% 50%;
        }
        @media (min-width: 768px) {
          .animate-pulse-slow {
            animation: pulse-slow 10s ease-in-out infinite;
            transform-origin: 60% 50%;
          }
        }
      `}</style>
    </div>
  );
}
