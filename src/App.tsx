/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, CheckCircle2, Mail, Shield, Zap, Wallet, Globe, TrendingUp, Users, ChevronDown, User, Phone, MapPin, Search } from 'lucide-react';
import { countries } from './countries';


// Add this data near the top of your component or in a separate file
const phonePrefixes = [
  // Africa
  { code: '+234', country: 'Nigeria', flag: '🇳🇬' },
  { code: '+27', country: 'South Africa', flag: '🇿🇦' },
  { code: '+233', country: 'Ghana', flag: '🇬🇭' },
  { code: '+254', country: 'Kenya', flag: '🇰🇪' },
  { code: '+255', country: 'Tanzania', flag: '🇹🇿' },
  { code: '+256', country: 'Uganda', flag: '🇺🇬' },
  { code: '+251', country: 'Ethiopia', flag: '🇪🇹' },
  { code: '+212', country: 'Morocco', flag: '🇲🇦' },
  { code: '+213', country: 'Algeria', flag: '🇩🇿' },
  { code: '+20', country: 'Egypt', flag: '🇪🇬' },
  { code: '+225', country: 'Côte d\'Ivoire', flag: '🇨🇮' },
  { code: '+237', country: 'Cameroon', flag: '🇨🇲' },
  { code: '+221', country: 'Senegal', flag: '🇸🇳' },
  { code: '+243', country: 'DR Congo', flag: '🇨🇩' },
  { code: '+242', country: 'Congo', flag: '🇨🇬' },
  { code: '+216', country: 'Tunisia', flag: '🇹🇳' },
  { code: '+218', country: 'Libya', flag: '🇱🇾' },
  { code: '+249', country: 'Sudan', flag: '🇸🇩' },
  { code: '+252', country: 'Somalia', flag: '🇸🇴' },
  { code: '+253', country: 'Djibouti', flag: '🇩🇯' },
  { code: '+291', country: 'Eritrea', flag: '🇪🇷' },
  { code: '+250', country: 'Rwanda', flag: '🇷🇼' },
  { code: '+257', country: 'Burundi', flag: '🇧🇮' },
  { code: '+258', country: 'Mozambique', flag: '🇲🇿' },
  { code: '+260', country: 'Zambia', flag: '🇿🇲' },
  { code: '+263', country: 'Zimbabwe', flag: '🇿🇼' },
  { code: '+264', country: 'Namibia', flag: '🇳🇦' },
  { code: '+265', country: 'Malawi', flag: '🇲🇼' },
  { code: '+266', country: 'Lesotho', flag: '🇱🇸' },
  { code: '+267', country: 'Botswana', flag: '🇧🇼' },
  { code: '+268', country: 'Eswatini', flag: '🇸🇿' },
  { code: '+269', country: 'Comoros', flag: '🇰🇲' },
  { code: '+220', country: 'Gambia', flag: '🇬🇲' },
  { code: '+222', country: 'Mauritania', flag: '🇲🇷' },
  { code: '+223', country: 'Mali', flag: '🇲🇱' },
  { code: '+224', country: 'Guinea', flag: '🇬🇳' },
  { code: '+226', country: 'Burkina Faso', flag: '🇧🇫' },
  { code: '+227', country: 'Niger', flag: '🇳🇪' },
  { code: '+228', country: 'Togo', flag: '🇹🇬' },
  { code: '+229', country: 'Benin', flag: '🇧🇯' },
  { code: '+230', country: 'Mauritius', flag: '🇲🇺' },
  { code: '+231', country: 'Liberia', flag: '🇱🇷' },
  { code: '+232', country: 'Sierra Leone', flag: '🇸🇱' },
  { code: '+235', country: 'Chad', flag: '🇹🇩' },
  { code: '+236', country: 'Central African Republic', flag: '🇨🇫' },
  { code: '+238', country: 'Cape Verde', flag: '🇨🇻' },
  { code: '+239', country: 'São Tomé and Príncipe', flag: '🇸🇹' },
  { code: '+240', country: 'Equatorial Guinea', flag: '🇬🇶' },
  { code: '+241', country: 'Gabon', flag: '🇬🇦' },
  { code: '+244', country: 'Angola', flag: '🇦🇴' },
  { code: '+245', country: 'Guinea-Bissau', flag: '🇬🇼' },
  { code: '+248', country: 'Seychelles', flag: '🇸🇨' },
  { code: '+261', country: 'Madagascar', flag: '🇲🇬' },
  { code: '+262', country: 'Réunion', flag: '🇷🇪' },

  // Americas
  { code: '+1', country: 'USA', flag: '🇺🇸' },
  { code: '+1', country: 'Canada', flag: '🇨🇦' },
  { code: '+52', country: 'Mexico', flag: '🇲🇽' },
  { code: '+55', country: 'Brazil', flag: '🇧🇷' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷' },
  { code: '+56', country: 'Chile', flag: '🇨🇱' },
  { code: '+57', country: 'Colombia', flag: '🇨🇴' },
  { code: '+58', country: 'Venezuela', flag: '🇻🇪' },
  { code: '+51', country: 'Peru', flag: '🇵🇪' },
  { code: '+593', country: 'Ecuador', flag: '🇪🇨' },
  { code: '+591', country: 'Bolivia', flag: '🇧🇴' },
  { code: '+595', country: 'Paraguay', flag: '🇵🇾' },
  { code: '+598', country: 'Uruguay', flag: '🇺🇾' },
  { code: '+592', country: 'Guyana', flag: '🇬🇾' },
  { code: '+597', country: 'Suriname', flag: '🇸🇷' },
  { code: '+53', country: 'Cuba', flag: '🇨🇺' },
  { code: '+1-809', country: 'Dominican Republic', flag: '🇩🇴' },
  { code: '+509', country: 'Haiti', flag: '🇭🇹' },
  { code: '+502', country: 'Guatemala', flag: '🇬🇹' },
  { code: '+503', country: 'El Salvador', flag: '🇸🇻' },
  { code: '+504', country: 'Honduras', flag: '🇭🇳' },
  { code: '+505', country: 'Nicaragua', flag: '🇳🇮' },
  { code: '+506', country: 'Costa Rica', flag: '🇨🇷' },
  { code: '+507', country: 'Panama', flag: '🇵🇦' },
  { code: '+1-876', country: 'Jamaica', flag: '🇯🇲' },
  { code: '+1-868', country: 'Trinidad and Tobago', flag: '🇹🇹' },
  { code: '+1-246', country: 'Barbados', flag: '🇧🇧' },
  { code: '+1-758', country: 'Saint Lucia', flag: '🇱🇨' },

  // Europe
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+39', country: 'Italy', flag: '🇮🇹' },
  { code: '+34', country: 'Spain', flag: '🇪🇸' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹' },
  { code: '+31', country: 'Netherlands', flag: '🇳🇱' },
  { code: '+32', country: 'Belgium', flag: '🇧🇪' },
  { code: '+41', country: 'Switzerland', flag: '🇨🇭' },
  { code: '+43', country: 'Austria', flag: '🇦🇹' },
  { code: '+46', country: 'Sweden', flag: '🇸🇪' },
  { code: '+47', country: 'Norway', flag: '🇳🇴' },
  { code: '+45', country: 'Denmark', flag: '🇩🇰' },
  { code: '+358', country: 'Finland', flag: '🇫🇮' },
  { code: '+353', country: 'Ireland', flag: '🇮🇪' },
  { code: '+48', country: 'Poland', flag: '🇵🇱' },
  { code: '+420', country: 'Czech Republic', flag: '🇨🇿' },
  { code: '+36', country: 'Hungary', flag: '🇭🇺' },
  { code: '+40', country: 'Romania', flag: '🇷🇴' },
  { code: '+30', country: 'Greece', flag: '🇬🇷' },
  { code: '+380', country: 'Ukraine', flag: '🇺🇦' },
  { code: '+7', country: 'Russia', flag: '🇷🇺' },
  { code: '+90', country: 'Turkey', flag: '🇹🇷' },
  { code: '+371', country: 'Latvia', flag: '🇱🇻' },
  { code: '+370', country: 'Lithuania', flag: '🇱🇹' },
  { code: '+372', country: 'Estonia', flag: '🇪🇪' },
  { code: '+421', country: 'Slovakia', flag: '🇸🇰' },
  { code: '+386', country: 'Slovenia', flag: '🇸🇮' },
  { code: '+385', country: 'Croatia', flag: '🇭🇷' },
  { code: '+381', country: 'Serbia', flag: '🇷🇸' },
  { code: '+387', country: 'Bosnia & Herzegovina', flag: '🇧🇦' },
  { code: '+382', country: 'Montenegro', flag: '🇲🇪' },
  { code: '+383', country: 'Kosovo', flag: '🇽🇰' },
  { code: '+389', country: 'North Macedonia', flag: '🇲🇰' },
  { code: '+355', country: 'Albania', flag: '🇦🇱' },
  { code: '+359', country: 'Bulgaria', flag: '🇧🇬' },
  { code: '+373', country: 'Moldova', flag: '🇲🇩' },
  { code: '+375', country: 'Belarus', flag: '🇧🇾' },
  { code: '+352', country: 'Luxembourg', flag: '🇱🇺' },
  { code: '+356', country: 'Malta', flag: '🇲🇹' },
  { code: '+354', country: 'Iceland', flag: '🇮🇸' },
  { code: '+357', country: 'Cyprus', flag: '🇨🇾' },

  // Asia
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+86', country: 'China', flag: '🇨🇳' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+82', country: 'South Korea', flag: '🇰🇷' },
  { code: '+62', country: 'Indonesia', flag: '🇮🇩' },
  { code: '+63', country: 'Philippines', flag: '🇵🇭' },
  { code: '+84', country: 'Vietnam', flag: '🇻🇳' },
  { code: '+66', country: 'Thailand', flag: '🇹🇭' },
  { code: '+60', country: 'Malaysia', flag: '🇲🇾' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+95', country: 'Myanmar', flag: '🇲🇲' },
  { code: '+855', country: 'Cambodia', flag: '🇰🇭' },
  { code: '+856', country: 'Laos', flag: '🇱🇦' },
  { code: '+880', country: 'Bangladesh', flag: '🇧🇩' },
  { code: '+94', country: 'Sri Lanka', flag: '🇱🇰' },
  { code: '+977', country: 'Nepal', flag: '🇳🇵' },
  { code: '+92', country: 'Pakistan', flag: '🇵🇰' },
  { code: '+93', country: 'Afghanistan', flag: '🇦🇫' },
  { code: '+98', country: 'Iran', flag: '🇮🇷' },
  { code: '+964', country: 'Iraq', flag: '🇮🇶' },
  { code: '+963', country: 'Syria', flag: '🇸🇾' },
  { code: '+961', country: 'Lebanon', flag: '🇱🇧' },
  { code: '+962', country: 'Jordan', flag: '🇯🇴' },
  { code: '+972', country: 'Israel', flag: '🇮🇱' },
  { code: '+970', country: 'Palestine', flag: '🇵🇸' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' },
  { code: '+974', country: 'Qatar', flag: '🇶🇦' },
  { code: '+965', country: 'Kuwait', flag: '🇰🇼' },
  { code: '+973', country: 'Bahrain', flag: '🇧🇭' },
  { code: '+968', country: 'Oman', flag: '🇴🇲' },
  { code: '+967', country: 'Yemen', flag: '🇾🇪' },
  { code: '+7', country: 'Kazakhstan', flag: '🇰🇿' },
  { code: '+998', country: 'Uzbekistan', flag: '🇺🇿' },
  { code: '+996', country: 'Kyrgyzstan', flag: '🇰🇬' },
  { code: '+992', country: 'Tajikistan', flag: '🇹🇯' },
  { code: '+993', country: 'Turkmenistan', flag: '🇹🇲' },
  { code: '+994', country: 'Azerbaijan', flag: '🇦🇿' },
  { code: '+995', country: 'Georgia', flag: '🇬🇪' },
  { code: '+374', country: 'Armenia', flag: '🇦🇲' },
  { code: '+886', country: 'Taiwan', flag: '🇹🇼' },
  { code: '+852', country: 'Hong Kong', flag: '🇭🇰' },
  { code: '+853', country: 'Macau', flag: '🇲🇴' },
  { code: '+850', country: 'North Korea', flag: '🇰🇵' },
  { code: '+976', country: 'Mongolia', flag: '🇲🇳' },

  // Oceania
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+64', country: 'New Zealand', flag: '🇳🇿' },
  { code: '+679', country: 'Fiji', flag: '🇫🇯' },
  { code: '+675', country: 'Papua New Guinea', flag: '🇵🇬' },
  { code: '+677', country: 'Solomon Islands', flag: '🇸🇧' },
  { code: '+678', country: 'Vanuatu', flag: '🇻🇺' },
  { code: '+685', country: 'Samoa', flag: '🇼🇸' },
  { code: '+676', country: 'Tonga', flag: '🇹🇴' },
  { code: '+686', country: 'Kiribati', flag: '🇰🇮' },
];


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

  // Add this state near your other state declarations
  const [phonePrefix, setPhonePrefix] = useState('+233'); // Default to Ghana
  const [isPrefixOpen, setIsPrefixOpen] = useState(false);
  const [prefixSearch, setPrefixSearch] = useState('');
  const prefixDropdownRef = useRef<HTMLDivElement>(null);

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

  // Close prefix dropdown on outside click — add this alongside your other useEffects
useEffect(() => {
  const handleClickOutside = (e: MouseEvent) => {
    if (prefixDropdownRef.current && !prefixDropdownRef.current.contains(e.target as Node)) {
      setIsPrefixOpen(false);
      setPrefixSearch('');
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);

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
          phone: `${phonePrefix}${formData.phone}`,
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

        {/* Connect With Us — bottom of hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-white/25 font-medium">Connect With Us</span>
          <div className="flex items-center gap-3">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/usemansu?igsh=MWNydzFob2o2MGh0bw=="
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-fuchsia-500/20 hover:border-purple-500/30 transition-all duration-300 group"
            >
              <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span className="text-[11px] text-white/40 group-hover:text-white font-light transition-colors duration-300">Instagram</span>
            </a>

            {/* X / Twitter */}
            <a
              href="https://x.com/usemansu?s=21&t=i3Tmsr-HAJ31W7C90EoADQ"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
            >
              <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span className="text-[11px] text-white/40 group-hover:text-white font-light transition-colors duration-300">X (Twitter)</span>
            </a>

            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/company/mansuglobal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-blue-500/20 hover:border-blue-500/30 transition-all duration-300 group"
            >
              <svg className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
              <span className="text-[11px] text-white/40 group-hover:text-white font-light transition-colors duration-300">LinkedIn</span>
            </a>
          </div>
        </motion.div>
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
            <div 
              className="absolute inset-0 bg-black/70 backdrop-blur-xl" 
              onClick={() => setIsModalOpen(false)}
            />
            
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-md overflow-visible"
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
                      {/* Phone Number */}
<div>
  <div className={`flex items-center rounded-xl bg-white/[0.04] border transition-colors duration-300 ${formErrors.phone ? 'border-red-500/50' : 'border-white/[0.06] focus-within:border-purple-500/40'}`}>
    
    {/* Prefix Dropdown */}
    <div ref={prefixDropdownRef} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setIsPrefixOpen(!isPrefixOpen)}
        disabled={isLoading}
        className="flex items-center gap-1.5 px-3 py-3 border-r border-white/[0.06] hover:bg-white/[0.04] transition-colors duration-200 rounded-l-xl disabled:opacity-50"
      >
        <span className="text-base leading-none">
          {phonePrefixes.find(p => p.code === phonePrefix)?.flag}
        </span>
        <span className="text-xs text-white/60 font-light">{phonePrefix}</span>
        <ChevronDown className={`w-3 h-3 text-white/25 transition-transform duration-300 ${isPrefixOpen ? 'rotate-180' : ''}`} />
      </button>

      {isPrefixOpen && (
        <div className="absolute top-full left-0 mt-1 w-56 bg-[#1a1025] backdrop-blur-2xl border border-white/[0.1] rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.06]">
            <Search className="w-3.5 h-3.5 text-white/30" />
            <input
              type="text"
              placeholder="Search..."
              value={prefixSearch}
              onChange={(e) => setPrefixSearch(e.target.value)}
              className="bg-transparent border-none outline-none w-full text-xs placeholder:text-white/20 font-light text-white"
            />
          </div>
          {/* List */}
          <div className="max-h-48 overflow-y-auto scrollbar-thin">
            {phonePrefixes
              .filter(p =>
                p.country.toLowerCase().includes(prefixSearch.toLowerCase()) ||
                p.code.includes(prefixSearch)
              )
              .map((p) => (
                <button
                  key={`${p.code}-${p.country}`}
                  type="button"
                  onClick={() => {
                    setPhonePrefix(p.code);
                    setIsPrefixOpen(false);
                    setPrefixSearch('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs font-light transition-colors duration-200 hover:bg-purple-500/20 ${
                    phonePrefix === p.code ? 'text-purple-400 bg-purple-500/10' : 'text-white/60'
                  }`}
                >
                  <span className="text-base">{p.flag}</span>
                  <span className="flex-1 text-left">{p.country}</span>
                  <span className="text-white/30">{p.code}</span>
                </button>
              ))}
          </div>
        </div>
      )}
    </div>

    {/* Phone input */}
    <input
      type="tel"
      placeholder="Phone Number"
      value={formData.phone}
      onChange={(e) => handleInputChange('phone', e.target.value)}
      disabled={isLoading}
      className="bg-transparent border-none outline-none flex-1 text-sm px-3 py-3 placeholder:text-white/20 font-light disabled:opacity-50"
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
  className="p-8 bg-[#0d0a14]/95 backdrop-blur-2xl rounded-2xl border border-purple-500/30 text-center shadow-[0_0_80px_rgba(139,92,246,0.15)] overflow-y-auto max-h-[90vh]"
>
  <CheckCircle2 className="w-12 h-12 text-purple-400 mx-auto mb-4" />
  <h3 className="text-xl font-semibold mb-2">You're on the list!</h3>
  <p className="text-sm text-white/45 font-light">We'll notify you as soon as we launch. Get ready for ease.</p>

  <div className="mt-8 pt-6 border-t border-white/[0.06]">
    <p className="text-[11px] uppercase tracking-[0.2em] text-white/25 font-medium mb-4">Follow us for updates</p>
    <div className="flex items-center justify-center gap-3">

      {/* Instagram */}
      <a
        href="https://www.instagram.com/usemansu?igsh=MWNydzFob2o2MGh0bw=="
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-gradient-to-r hover:from-purple-500/20 hover:to-fuchsia-500/20 hover:border-purple-500/30 transition-all duration-300 group"
      >
        <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
        <span className="text-[12px] text-white/50 group-hover:text-white font-light transition-colors duration-300">Instagram</span>
      </a>

      {/* X / Twitter */}
      <a
        href="https://x.com/usemansu?s=21&t=i3Tmsr-HAJ31W7C90EoADQ"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
      >
        <svg className="w-4 h-4 text-white/50 group-hover:text-white transition-colors duration-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span className="text-[12px] text-white/50 group-hover:text-white font-light transition-colors duration-300">X (Twitter)</span>
      </a>

    </div>
  </div>
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
