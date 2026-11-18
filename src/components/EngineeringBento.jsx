import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Terminal,
  GitBranch,
  Cpu,
  ShieldCheck,
  Layers,
  Sparkles,
  ExternalLink,
  Star,
  Code2,
  Trophy,
  Activity,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import SpotlightCard from './SpotlightCard';

const TERMINAL_COMMANDS = {
  whoami: {
    output: [
      '→ Radouane EL-ASRI | Computer Engineering Student @ UPF & Full-Stack Engineer',
      '→ Location: Fez, Morocco 🇲🇦',
      '→ Focus: Scalable Web Apps, Open-Weight AI (Gemma/LLMs), & Automated QA (ISTQB®)',
    ],
  },
  hackathons: {
    output: [
      '🏆 Build with Gemma Hackathon (Technopark Casablanca, July 2026) — 1st Place & Certified',
      '🚀 2026 NASA Space Apps Challenge (Nov 2026) — Galactic Problem Solver',
      '🇲🇦 Rally IA Future Lab (Merzouga, June 2026) — National AI Talent (AI Made in Morocco)',
    ],
  },
  stack: {
    output: [
      '• Frontend : React 19, TypeScript, Tailwind CSS, Framer Motion, Angular',
      '• Backend  : Node.js, Spring Boot, Java, .NET/C#, Supabase, PostgreSQL',
      '• AI & QA  : Google Gemma, Python, Selenium E2E, ISTQB® CTFL, Docker',
    ],
  },
  contact: {
    output: [
      '📧 Email    : radouane.elasri@usmba.ac.ma',
      '📱 Phone    : +212 609365349',
      '🔗 LinkedIn : linkedin.com/in/radouane-elasri',
      '🐙 GitHub   : github.com/radouane99',
    ],
  },
};

// Deterministic contribution matrix for visual GitHub pulse
const CONTRIB_LEVELS = [
  1, 2, 0, 3, 4, 2, 1, 3, 4, 4, 2, 1, 0, 2, 3, 4, 3, 2, 4, 4, 3, 1, 2, 4, 3, 4, 2, 3,
  2, 3, 4, 2, 1, 3, 4, 2, 3, 4, 4, 3, 2, 4, 3, 1, 2, 3, 4, 4, 2, 3, 4, 3, 4, 4, 3, 4,
];

export default function EngineeringBento() {
  const { isDarkMode: dark } = useTheme();
  const { t } = useTranslation();

  // Interactive Terminal State
  const [activeCmd, setActiveCmd] = useState('hackathons');
  const [cmdHistory, setCmdHistory] = useState([
    { cmd: 'whoami', lines: TERMINAL_COMMANDS.whoami.output },
    { cmd: 'hackathons', lines: TERMINAL_COMMANDS.hackathons.output },
  ]);

  // Live GitHub State
  const [githubData, setGithubData] = useState({
    public_repos: 18,
    followers: 15,
    topRepos: [
      {
        name: 'Portfolio',
        description: 'Full-Stack React 19 + Supabase + Gemini AI Portfolio with Admin Dashboard',
        language: 'JavaScript',
        url: 'https://github.com/radouane99',
      },
      {
        name: 'Gemma-AI-Solution',
        description: 'Lightweight open-weight AI application built for Build with Gemma Hackathon',
        language: 'Python',
        url: 'https://github.com/radouane99',
      },
    ],
  });

  useEffect(() => {
    let mounted = true;
    fetch('https://api.github.com/users/radouane99')
      .then((r) => (r.ok ? r.json() : null))
      .then((user) => {
        if (mounted && user && typeof user.public_repos === 'number') {
          setGithubData((prev) => ({
            ...prev,
            public_repos: Math.max(user.public_repos, 12),
            followers: user.followers || prev.followers,
          }));
        }
      })
      .catch(() => {});

    return () => {
      mounted = false;
    };
  }, []);

  const runTerminalCommand = (cmd) => {
    setActiveCmd(cmd);
    if (cmd === 'clear') {
      setCmdHistory([]);
      return;
    }
    const entry = TERMINAL_COMMANDS[cmd];
    if (entry) {
      setCmdHistory((prev) => [...prev.slice(-2), { cmd, lines: entry.output }]);
    }
  };

  const pillars = [
    {
      icon: Layers,
      title: t('bento.pillar1_title', { defaultValue: 'Full-Stack Architecture' }),
      desc: t('bento.pillar1_desc', {
        defaultValue: 'End-to-end scalable web systems using React, TypeScript, Node.js, Spring Boot, and PostgreSQL/Supabase.',
      }),
      color: 'from-violet-500 to-purple-500',
    },
    {
      icon: Cpu,
      title: t('bento.pillar2_title', { defaultValue: 'AI & Open-Weight LLMs' }),
      desc: t('bento.pillar2_desc', {
        defaultValue: 'Building intelligent agents and lightweight LLM workflows (Google Gemma, Gemini, RAG) tested in national hackathons.',
      }),
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: ShieldCheck,
      title: t('bento.pillar3_title', { defaultValue: 'ISTQB® QA & Automation' }),
      desc: t('bento.pillar3_desc', {
        defaultValue: 'Certified software testing methodology combined with Python & Selenium automation for zero-defect delivery.',
      }),
      color: 'from-cyan-500 to-blue-500',
    },
  ];

  return (
    <div
      className={`py-20 px-4 sm:px-6 relative overflow-hidden ${
        dark ? 'bg-[#08080f]' : 'bg-[#f8f7ff]'
      }`}
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-14 reveal">
          <div className="section-tag mb-4 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {t('bento.badge', { defaultValue: 'Engineering DNA' })}
          </div>
          <h2
            className={`font-head font-bold text-4xl md:text-5xl mb-4 ${
              dark ? 'text-white' : 'text-gray-900'
            }`}
          >
            {t('bento.title_part1', { defaultValue: 'Architecture, AI &' })}{' '}
            <span className="grad-text">
              {t('bento.title_part2', { defaultValue: 'Open Source Pulse' })}
            </span>
          </h2>
          <p
            className={`max-w-2xl mx-auto text-base md:text-lg ${
              dark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {t('bento.subtitle', {
              defaultValue:
                'Bridging software engineering rigor, AI innovation, and certified quality assurance.',
            })}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Top-Left: 3 Engineering Pillars (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-1 gap-5">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              return (
                <SpotlightCard
                  key={i}
                  maxTilt={3}
                  className={`cursor-target rounded-3xl p-6 border ${
                    dark
                      ? 'bg-white/[0.04] border-white/10 hover:border-violet-500/40'
                      : 'bg-white border-violet-100 hover:border-violet-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3.5 rounded-2xl bg-gradient-to-br ${pillar.color} text-white shadow-lg shrink-0`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3
                        className={`text-lg font-bold font-head mb-1.5 ${
                          dark ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {pillar.title}
                      </h3>
                      <p
                        className={`text-sm leading-relaxed ${
                          dark ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        {pillar.desc}
                      </p>
                    </div>
                  </div>
                </SpotlightCard>
              );
            })}
          </div>

          {/* Top-Right: Interactive Developer Terminal (5 cols) */}
          <div className="lg:col-span-5">
            <SpotlightCard
              maxTilt={3}
              className={`rounded-3xl border h-full flex flex-col overflow-hidden ${
                dark
                  ? 'bg-[#0c0c18] border-violet-500/25 shadow-2xl shadow-violet-500/10'
                  : 'bg-gray-900 border-violet-300 text-white shadow-xl'
              }`}
            >
              {/* Terminal Top Bar */}
              <div className="px-4 py-3 bg-white/5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500" />
                  <span className="w-3 h-3 rounded-full bg-amber-400" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-gray-400 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-violet-400" />
                    radouane@elasri.cloud:~
                  </span>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/20 text-violet-300 border border-violet-500/30">
                  Interactive CLI
                </span>
              </div>

              {/* Command Buttons */}
              <div className="px-4 py-2.5 bg-white/[0.02] border-b border-white/10 flex flex-wrap gap-1.5">
                {['whoami', 'hackathons', 'stack', 'contact', 'clear'].map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => runTerminalCommand(cmd)}
                    className={`cursor-target px-2.5 py-1 rounded-lg font-mono text-xs transition-all ${
                      activeCmd === cmd
                        ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold shadow'
                        : 'bg-white/5 text-gray-300 hover:bg-white/15 hover:text-white'
                    }`}
                  >
                    $ {cmd}
                  </button>
                ))}
              </div>

              {/* Terminal Body */}
              <div className="p-5 font-mono text-xs space-y-4 flex-1 overflow-y-auto max-h-80 text-gray-200">
                {cmdHistory.length === 0 ? (
                  <p className="text-gray-500">
                    Terminal cleared. Click a command above to inspect profile...
                  </p>
                ) : (
                  cmdHistory.map((item, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center gap-2 text-violet-400 font-semibold">
                        <span>➜</span>
                        <span className="text-pink-400">~</span>
                        <span className="text-white">{item.cmd}</span>
                      </div>
                      <div className="pl-4 space-y-1 text-gray-300 leading-relaxed">
                        {item.lines.map((line, lIdx) => (
                          <div key={lIdx}>{line}</div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
                <div className="flex items-center gap-2 text-violet-400 pt-1">
                  <span>➜</span>
                  <span className="text-pink-400">~</span>
                  <span className="w-2 h-4 bg-violet-400 animate-pulse inline-block" />
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* Bottom Full-Width Card: Live GitHub & Hackathon Ecosystem Pulse (12 cols) */}
          <div className="lg:col-span-12">
            <SpotlightCard
              maxTilt={2}
              className={`rounded-3xl p-6 sm:p-8 border ${
                dark
                  ? 'bg-white/[0.04] border-white/10 hover:border-violet-500/40'
                  : 'bg-white border-violet-100 hover:border-violet-300 shadow-sm'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                {/* Left: GitHub Identity & Live Metrics */}
                <div className="space-y-4 max-w-xl">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    <Activity className="w-3.5 h-3.5 animate-pulse" />
                    {t('bento.github_live', { defaultValue: 'Live GitHub & Hackathon Activity' })}
                  </div>

                  <h3
                    className={`text-2xl sm:text-3xl font-bold font-head ${
                      dark ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {t('bento.github_title', {
                      defaultValue: 'Continuous Shipping & Open-Source Engineering',
                    })}
                  </h3>

                  <p
                    className={`text-sm leading-relaxed ${
                      dark ? 'text-gray-300' : 'text-gray-600'
                    }`}
                  >
                    {t('bento.github_desc', {
                      defaultValue:
                        'From 48-hour national AI hackathons (Rally IA Merzouga, Build with Gemma Casablanca, NASA Space Apps) to production full-stack repositories.',
                    })}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 pt-1">
                    <div
                      className={`px-4 py-2 rounded-xl border ${
                        dark ? 'bg-white/5 border-white/10' : 'bg-violet-50 border-violet-100'
                      }`}
                    >
                      <span className="text-lg font-bold grad-text font-head">
                        {githubData.public_repos}+
                      </span>
                      <span
                        className={`ml-2 text-xs font-medium ${
                          dark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Public Repos
                      </span>
                    </div>

                    <div
                      className={`px-4 py-2 rounded-xl border ${
                        dark ? 'bg-white/5 border-white/10' : 'bg-violet-50 border-violet-100'
                      }`}
                    >
                      <span className="text-lg font-bold grad-text font-head">3 🏆</span>
                      <span
                        className={`ml-2 text-xs font-medium ${
                          dark ? 'text-gray-400' : 'text-gray-600'
                        }`}
                      >
                        Major Hackathons (2026)
                      </span>
                    </div>

                    <a
                      href="https://github.com/radouane99"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cursor-target inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-600 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                    >
                      <GitBranch className="w-4 h-4" />
                      @radouane99
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Right: Visual Contribution Matrix */}
                <div className="flex-1 flex flex-col items-center lg:items-end">
                  <div
                    className={`p-4 rounded-2xl border w-full max-w-md ${
                      dark ? 'bg-[#08080f]/80 border-white/10' : 'bg-violet-50/60 border-violet-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className={`font-mono font-semibold ${dark ? 'text-gray-300' : 'text-gray-700'}`}>
                        Contribution Pulse
                      </span>
                      <span className="text-emerald-400 font-mono text-[11px]">Active 2026</span>
                    </div>
                    <div className="grid grid-cols-14 gap-1.5">
                      {CONTRIB_LEVELS.map((lvl, idx) => {
                        const colorsDark = [
                          'bg-white/5',
                          'bg-violet-900/60',
                          'bg-violet-700/80',
                          'bg-violet-500',
                          'bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]',
                        ];
                        const colorsLight = [
                          'bg-violet-100',
                          'bg-violet-200',
                          'bg-violet-400',
                          'bg-violet-600',
                          'bg-pink-500',
                        ];
                        return (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.01 }}
                            className={`h-3.5 rounded-sm ${
                              dark ? colorsDark[lvl] : colorsLight[lvl]
                            }`}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>
        </div>
      </div>
    </div>
  );
}
