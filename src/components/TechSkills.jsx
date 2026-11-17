import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Server, ShieldCheck, Wrench, Sparkles, Layers } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import SpotlightCard from './SpotlightCard';

import reactIcon from '../assets/img/physics.png';
import javascriptIcon from '../assets/img/js.png';
import typescriptIcon from '../assets/img/typescript.png';
import nodejsIcon from '../assets/img/node-js.png';
import mongodbIcon from '../assets/img/database.png';
import tailwindIcon from '../assets/img/Tailwind-CSS.png';
import figmaIcon from '../assets/img/figma.png';
import gitIcon from '../assets/img/github-sign.png';
import javaIcon from '../assets/img/java.png';
import angularjs from '../assets/img/angularjs.png';
import springboot from '../assets/img/spring-boot.png';
import SeleniumLogo from '../assets/img/Selenium_Logo.png';
import MachineLearning from '../assets/img/brain.png';
import dotNet from '../assets/img/NET.png';
import Python from '../assets/img/Python.png';
import PostgresSQL from '../assets/img/PostgresSQL.png';
import supabaseImg from '../assets/img/supabase.png';
import dockerImg from '../assets/img/docker.png';
import phpImg from '../assets/img/php.png';
import istqbImg from '../assets/img/ISTQB.png';

const SKILL_CATEGORIES = [
  {
    id: 'all',
    labelKey: 'skills_section.cat_all',
    defaultLabel: 'All Stack',
    icon: Layers,
  },
  {
    id: 'frontend',
    labelKey: 'skills_section.cat_frontend',
    defaultLabel: 'Frontend & UI',
    icon: Code2,
  },
  {
    id: 'backend',
    labelKey: 'skills_section.cat_backend',
    defaultLabel: 'Backend & DB',
    icon: Server,
  },
  {
    id: 'qa_ai',
    labelKey: 'skills_section.cat_qa_ai',
    defaultLabel: 'QA, Testing & AI',
    icon: ShieldCheck,
  },
  {
    id: 'devops',
    labelKey: 'skills_section.cat_devops',
    defaultLabel: 'DevOps & Tools',
    icon: Wrench,
  },
];

const SKILLS_LIST = [
  { name: 'React.js', category: 'frontend', level: 92, icon: reactIcon, tagKey: 'skills_section.tag_core' },
  { name: 'TypeScript', category: 'frontend', level: 85, icon: typescriptIcon, tagKey: 'skills_section.tag_core' },
  { name: 'JavaScript (ES6+)', category: 'frontend', level: 95, icon: javascriptIcon, tagKey: 'skills_section.tag_core' },
  { name: 'Tailwind CSS', category: 'frontend', level: 95, icon: tailwindIcon, tagKey: 'skills_section.tag_core' },
  { name: 'Angular', category: 'frontend', level: 78, icon: angularjs, tagKey: 'skills_section.tag_pro' },
  { name: 'Figma & UI/UX', category: 'frontend', level: 85, icon: figmaIcon, tagKey: 'skills_section.tag_design' },

  { name: 'Node.js & Express', category: 'backend', level: 88, icon: nodejsIcon, tagKey: 'skills_section.tag_core' },
  { name: 'Supabase', category: 'backend', level: 90, icon: supabaseImg, tagKey: 'skills_section.tag_core' },
  { name: 'PostgreSQL', category: 'backend', level: 88, icon: PostgresSQL, tagKey: 'skills_section.tag_core' },
  { name: 'Spring Boot', category: 'backend', level: 80, icon: springboot, tagKey: 'skills_section.tag_pro' },
  { name: 'Java', category: 'backend', level: 85, icon: javaIcon, tagKey: 'skills_section.tag_core' },
  { name: '.NET / C#', category: 'backend', level: 80, icon: dotNet, tagKey: 'skills_section.tag_pro' },
  { name: 'PHP', category: 'backend', level: 78, icon: phpImg, tagKey: 'skills_section.tag_pro' },
  { name: 'MongoDB / SQL', category: 'backend', level: 84, icon: mongodbIcon, tagKey: 'skills_section.tag_pro' },

  { name: 'Selenium Automation', category: 'qa_ai', level: 92, icon: SeleniumLogo, tagKey: 'skills_section.tag_expert' },
  { name: 'ISTQB® QA Testing', category: 'qa_ai', level: 90, icon: istqbImg, tagKey: 'skills_section.tag_certified' },
  { name: 'Python', category: 'qa_ai', level: 88, icon: Python, tagKey: 'skills_section.tag_core' },
  { name: 'Machine Learning', category: 'qa_ai', level: 76, icon: MachineLearning, tagKey: 'skills_section.tag_ai' },

  { name: 'Docker', category: 'devops', level: 78, icon: dockerImg, tagKey: 'skills_section.tag_devops' },
  { name: 'Git & GitHub CI/CD', category: 'devops', level: 92, icon: gitIcon, tagKey: 'skills_section.tag_core' },
];

export default function TechSkills() {
  const { isDarkMode: dark } = useTheme();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredSkills = activeCategory === 'all'
    ? SKILLS_LIST
    : SKILLS_LIST.filter(s => s.category === activeCategory);

  return (
    <div
      className={`py-24 px-4 sm:px-6 relative overflow-hidden ${dark ? 'bg-[#08080f]' : 'bg-[#f8f7ff]'}`}
      style={
        dark
          ? { background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 65%), #08080f' }
          : { background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 65%), #f8f7ff' }
      }
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14 reveal">
          <div className="section-tag mb-5 inline-flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5" />
            {t('skills_section.badge', { defaultValue: 'Technical Arsenal' })}
          </div>
          <h2 className={`font-head font-bold text-4xl md:text-6xl mb-5 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            {t('skills_section.title_part1', { defaultValue: 'Skills &' })}{' '}
            <span className="grad-text">{t('skills_section.title_part2', { defaultValue: 'Technologies' })}</span>
          </h2>
          <p className={`max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('skills_section.subtitle', {
              defaultValue: 'A comprehensive toolkit spanning full-stack web development, automated software testing (ISTQB®), and scalable cloud architectures.',
            })}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-12">
          {SKILL_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const active = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`cursor-target flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                  active
                    ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white border-transparent shadow-lg shadow-violet-500/25 scale-105'
                    : dark
                      ? 'bg-white/5 border-white/10 text-gray-300 hover:border-violet-500/40 hover:text-white'
                      : 'bg-white border-violet-100 text-gray-700 hover:border-violet-300 hover:text-violet-700 shadow-sm'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{t(cat.labelKey, { defaultValue: cat.defaultLabel })}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          <AnimatePresence mode="popLayout">
            {filteredSkills.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                <SpotlightCard
                  maxTilt={6}
                  className={`cursor-target group rounded-2xl p-5 border h-full ${
                    dark
                      ? 'bg-white/[0.04] border-white/10 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/10'
                      : 'bg-white border-violet-100 hover:border-violet-300 hover:shadow-xl hover:shadow-violet-500/10'
                  }`}
                >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className={`w-11 h-11 rounded-xl flex items-center justify-center p-2 border transition-transform duration-300 group-hover:scale-110 ${
                        dark
                          ? 'bg-violet-500/10 border-violet-500/20'
                          : 'bg-violet-50 border-violet-100'
                      }`}
                    >
                      <img
                        src={skill.icon}
                        alt={skill.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm sm:text-base ${dark ? 'text-white' : 'text-gray-900'}`}>
                        {skill.name}
                      </h3>
                      <span
                        className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                          dark
                            ? 'bg-violet-500/15 text-violet-300'
                            : 'bg-violet-100 text-violet-700'
                        }`}
                      >
                        {t(skill.tagKey, { defaultValue: 'Proficient' })}
                      </span>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${dark ? 'text-violet-400' : 'text-violet-600'}`}>
                    {skill.level}%
                  </span>
                </div>

                {/* Progress Bar */}
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${dark ? 'bg-white/10' : 'bg-violet-100'}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500"
                  />
                </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
