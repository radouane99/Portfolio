import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trophy,
  FolderKanban,
  Award,
  Download,
  Moon,
  Sun,
  Globe,
  Mail,
  Home,
  Code2,
  Lock,
  X,
  Command,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import resumePDF from '../assets/img/Radouane-ELASRI_CV.pdf';

export default function CommandPalette({ isOpen, onClose }) {
  const { isDarkMode: dark, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  // Global Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(true); // toggle open
      } else if (e.key === 'Escape' && isOpen) {
        onClose(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const jumpTo = (id) => {
    onClose(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate(`/#${id}`);
    }
  };

  const actions = [
    {
      id: 'hackathons',
      label: 'View Hackathons (NASA Space Apps, Gemma AI, Rally IA)',
      category: 'Navigation',
      icon: Trophy,
      action: () => jumpTo('hackathons'),
    },
    {
      id: 'projects',
      label: 'Explore Featured Projects',
      category: 'Navigation',
      icon: FolderKanban,
      action: () => jumpTo('projects'),
    },
    {
      id: 'skills',
      label: 'Technical Skills & ISTQB® Stack',
      category: 'Navigation',
      icon: Code2,
      action: () => jumpTo('skills'),
    },
    {
      id: 'certificates',
      label: 'Open All Official Certificates & Diplomas',
      category: 'Credentials',
      icon: Award,
      action: () => {
        onClose(false);
        navigate('/certificates');
      },
    },
    {
      id: 'resume',
      label: 'Download Resume / CV (PDF)',
      category: 'Actions',
      icon: Download,
      action: () => {
        onClose(false);
        const a = document.createElement('a');
        a.href = resumePDF;
        a.download = 'Radouane-ELASRI_CV.pdf';
        a.click();
      },
    },
    {
      id: 'theme',
      label: dark ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙',
      category: 'Preferences',
      icon: dark ? Sun : Moon,
      action: () => {
        toggleTheme();
        onClose(false);
      },
    },
    {
      id: 'lang',
      label: i18n.language?.startsWith('fr')
        ? 'Switch Language to English 🇬🇧'
        : 'Changer la langue en Français 🇫🇷',
      category: 'Preferences',
      icon: Globe,
      action: () => {
        const nextLang = i18n.language?.startsWith('fr') ? 'en' : 'fr';
        i18n.changeLanguage(nextLang);
        onClose(false);
      },
    },
    {
      id: 'contact',
      label: 'Contact Radouane EL-ASRI',
      category: 'Navigation',
      icon: Mail,
      action: () => jumpTo('contact'),
    },
    {
      id: 'admin',
      label: 'Admin Dashboard (Login / Manage Portfolio)',
      category: 'Admin',
      icon: Lock,
      action: () => {
        onClose(false);
        navigate('/dashboard');
      },
    },
  ];

  const filtered = actions.filter((a) =>
    a.label.toLowerCase().includes(query.toLowerCase().trim())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-start justify-center pt-24 px-4 bg-black/70 backdrop-blur-md"
          onClick={() => onClose(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-xl rounded-3xl border shadow-2xl overflow-hidden ${
              dark
                ? 'bg-[#0d0d1a] border-violet-500/30 text-white'
                : 'bg-white border-violet-200 text-gray-900'
            }`}
          >
            {/* Search Input */}
            <div
              className={`flex items-center gap-3 px-5 py-4 border-b ${
                dark ? 'border-white/10' : 'border-violet-100'
              }`}
            >
              <Search className="w-5 h-5 text-violet-400 shrink-0" />
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search (e.g. hackathons, cv, projects)..."
                className="flex-1 bg-transparent text-sm outline-none placeholder-gray-400"
              />
              <button
                onClick={() => onClose(false)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-400"
              >
                ESC
              </button>
            </div>

            {/* Action List */}
            <div className="max-h-80 overflow-y-auto p-3 space-y-1">
              {filtered.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className={`cursor-target w-full flex items-center justify-between px-4 py-3 rounded-2xl text-left text-sm transition-all ${
                      dark
                        ? 'hover:bg-violet-500/20 text-gray-200 hover:text-white'
                        : 'hover:bg-violet-50 text-gray-700 hover:text-violet-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl ${
                          dark
                            ? 'bg-violet-500/15 text-violet-300'
                            : 'bg-violet-100 text-violet-600'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                        dark ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {item.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
