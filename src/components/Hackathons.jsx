import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Calendar,
  MapPin,
  Award,
  ExternalLink,
  Eye,
  X,
  Download,
  Building2,
  Rocket,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../contexts/ThemeContext';
import { getHackathons } from '../services/hackathonsService';

export default function Hackathons() {
  const { isDarkMode: dark } = useTheme();
  const { t } = useTranslation();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertHackathon, setSelectedCertHackathon] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const { data } = await getHackathons();
      if (mounted && data) {
        setHackathons(data);
      }
      if (mounted) setLoading(false);
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Localize default fallback items if they match hack-nasa-2026 or hack-gemma-2026
  const getLocalizedField = (item, field) => {
    if (item.id === 'hack-nasa-2026' || item.id === 'hack-gemma-2026') {
      const safeId = item.id.replace(/-/g, '_');
      const key = `hackathons.default_${safeId}_${field}`;
      const translated = t(key, { defaultValue: '' });
      if (translated && translated !== key) return translated;
    }
    return item[field] || '';
  };

  return (
    <div
      className={`py-24 px-4 sm:px-6 relative overflow-hidden ${dark ? 'bg-[#08080f]' : 'bg-[#f8f7ff]'}`}
      style={
        dark
          ? { background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(236,72,153,0.10) 0%, transparent 65%), #08080f' }
          : { background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(236,72,153,0.06) 0%, transparent 65%), #f8f7ff' }
      }
    >
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <div className="section-tag mb-5 inline-flex items-center gap-2">
            <Trophy className="w-3.5 h-3.5" />
            {t('hackathons.badge', { defaultValue: 'Competitions & Innovation' })}
          </div>

          <h2 className={`font-head font-bold text-4xl md:text-6xl mb-5 leading-tight ${dark ? 'text-white' : 'text-gray-900'}`}>
            {t('hackathons.title_part1', { defaultValue: 'Hackathons &' })}{' '}
            <span className="grad-text">{t('hackathons.title_part2', { defaultValue: 'Awards' })}</span>
          </h2>

          <p className={`max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
            {t('hackathons.subtitle', {
              defaultValue: 'Turning bold ideas into working prototypes under pressure — collaborating, innovating, and competing in tech hackathons.',
            })}
          </p>
        </div>

        {/* Hackathons Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-96 rounded-3xl animate-pulse border ${
                  dark ? 'bg-white/5 border-white/10' : 'bg-white border-violet-100'
                }`}
              />
            ))}
          </div>
        ) : (
          <div
            className={`grid grid-cols-1 md:grid-cols-2 ${
              hackathons.length >= 3 ? 'lg:grid-cols-3' : 'max-w-5xl mx-auto'
            } gap-8`}
          >
            {hackathons.map((hack, idx) => {
              const title = getLocalizedField(hack, 'title');
              const award = getLocalizedField(hack, 'award');
              const description = getLocalizedField(hack, 'description');
              const techs = Array.isArray(hack.technologies) ? hack.technologies : [];

              return (
                <motion.div
                  key={hack.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className={`cursor-target group relative rounded-3xl border overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                    dark
                      ? 'bg-white/[0.04] border-white/10 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/15'
                      : 'bg-white border-violet-100 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10'
                  }`}
                >
                  {/* Cover / Certificate Preview + Award Badge */}
                  <div
                    onClick={() => setSelectedCertHackathon(hack)}
                    className="relative h-60 overflow-hidden cursor-pointer bg-black/20"
                  >
                    <img
                      src={
                        hack.image_url ||
                        hack.certificate_image_url ||
                        'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=1000'
                      }
                      alt={title}
                      className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${
                        dark
                          ? 'from-[#08080f] via-[#08080f]/40 to-transparent'
                          : 'from-black/60 via-black/20 to-transparent'
                      }`}
                    />

                    {/* Award Ribbon */}
                    {award && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-lg bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 text-white">
                          <Trophy className="w-3.5 h-3.5" />
                          {award}
                        </span>
                      </div>
                    )}

                    {/* Project Built Tag */}
                    {hack.project_name && (
                      <div className="absolute bottom-3 left-4 z-10">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold backdrop-blur-md bg-violet-500/30 border border-violet-400/40 text-white">
                          <Rocket className="w-3.5 h-3.5 text-violet-200" />
                          {hack.project_name}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center gap-3 text-xs mb-3">
                      {hack.organizer && (
                        <span className={`inline-flex items-center gap-1 font-semibold ${dark ? 'text-violet-400' : 'text-violet-600'}`}>
                          <Building2 className="w-3.5 h-3.5" />
                          {hack.organizer}
                        </span>
                      )}
                      {hack.event_date && (
                        <span className={`inline-flex items-center gap-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <Calendar className="w-3.5 h-3.5" />
                          {hack.event_date}
                        </span>
                      )}
                      {hack.location && (
                        <span className={`inline-flex items-center gap-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <MapPin className="w-3.5 h-3.5" />
                          {hack.location}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className={`text-xl font-bold font-head mb-2.5 leading-snug ${dark ? 'text-white' : 'text-gray-900'}`}>
                      {title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm leading-relaxed mb-5 flex-1 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {description}
                    </p>

                    {/* Tech Stack */}
                    {techs.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {techs.map((tech, i) => (
                          <span
                            key={i}
                            className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                              dark
                                ? 'bg-violet-500/10 text-violet-300 border-violet-500/25'
                                : 'bg-violet-50 text-violet-700 border-violet-200'
                            }`}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className={`pt-4 border-t flex flex-wrap gap-2.5 ${dark ? 'border-white/10' : 'border-violet-100'}`}>
                      <button
                        type="button"
                        onClick={() => setSelectedCertHackathon(hack)}
                        className="cursor-target flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-violet-500 to-pink-500 hover:shadow-lg hover:shadow-violet-500/25 transition-all duration-300 hover:scale-[1.02]"
                      >
                        <Award className="w-4 h-4" />
                        {t('hackathons.view_certificate', { defaultValue: 'Certificate' })}
                      </button>

                      {hack.project_url && hack.project_url !== '#' && (
                        <a
                          href={hack.project_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`cursor-target inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all duration-300 hover:scale-[1.02] ${
                            dark
                              ? 'bg-white/5 border-white/15 text-gray-200 hover:border-violet-400 hover:text-white'
                              : 'bg-violet-50/70 border-violet-200 text-violet-700 hover:bg-violet-100'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t('hackathons.project_link', { defaultValue: 'Project' })}
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Banner to All Certificates */}
        <div className="mt-14 text-center reveal">
          <Link
            to="/certificates"
            className={`cursor-target inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold border transition-all duration-300 hover:scale-105 ${
              dark
                ? 'bg-white/5 border-violet-500/30 text-violet-300 hover:bg-violet-500/15 hover:border-violet-400'
                : 'bg-white border-violet-200 text-violet-700 hover:bg-violet-50 shadow-sm'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {t('hackathons.explore_all_certs', { defaultValue: 'View All Official Certifications & Diplomas' })}
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Certificate Lightbox Modal */}
      <AnimatePresence>
        {selectedCertHackathon && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
            onClick={() => setSelectedCertHackathon(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-2xl rounded-3xl border p-6 sm:p-8 shadow-2xl overflow-hidden ${
                dark ? 'bg-[#0d0d1a] border-violet-500/30 text-white' : 'bg-white border-violet-200 text-gray-900'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedCertHackathon(null)}
                className={`absolute top-5 right-5 p-2 rounded-xl transition-colors ${
                  dark ? 'bg-white/10 hover:bg-white/20 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-violet-500 to-pink-500 text-white shadow-lg">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className={`text-xs font-bold uppercase tracking-wider ${dark ? 'text-violet-400' : 'text-violet-600'}`}>
                    {t('hackathons.cert_modal_badge', { defaultValue: 'Hackathon Certificate & Proof' })}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold font-head">
                    {getLocalizedField(selectedCertHackathon, 'title')}
                  </h3>
                </div>
              </div>

              {/* Certificate Image or Styled Digital Certificate */}
              {selectedCertHackathon.certificate_image_url ? (
                <div className="rounded-2xl overflow-hidden border border-violet-500/20 bg-black/20 mb-6">
                  <img
                    src={selectedCertHackathon.certificate_image_url}
                    alt={`${selectedCertHackathon.title} Certificate`}
                    className="w-full max-h-[60vh] object-contain mx-auto"
                  />
                </div>
              ) : (
                <div
                  className={`rounded-2xl p-8 border-2 border-dashed mb-6 text-center relative overflow-hidden ${
                    dark
                      ? 'bg-gradient-to-br from-violet-950/40 via-[#08080f] to-pink-950/30 border-violet-500/30'
                      : 'bg-gradient-to-br from-violet-50 via-white to-pink-50 border-violet-300'
                  }`}
                >
                  <Trophy className="w-14 h-14 mx-auto mb-3 text-amber-400" />
                  <p className="text-xs uppercase tracking-widest font-bold text-violet-400 mb-1">
                    {selectedCertHackathon.organizer}
                  </p>
                  <h4 className="text-2xl font-bold font-head mb-2">
                    {getLocalizedField(selectedCertHackathon, 'award') || 'Certificate of Achievement'}
                  </h4>
                  <p className={`text-sm max-w-md mx-auto mb-4 ${dark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {t('hackathons.awarded_to', { defaultValue: 'Awarded to' })}{' '}
                    <strong className={dark ? 'text-white' : 'text-gray-900'}>Radouane EL-ASRI</strong>{' '}
                    {selectedCertHackathon.project_name
                      ? `(${selectedCertHackathon.project_name})`
                      : ''}
                  </p>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {selectedCertHackathon.event_date} • {selectedCertHackathon.location}
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="flex flex-wrap justify-end gap-3">
                {selectedCertHackathon.certificate_image_url && (
                  <a
                    href={selectedCertHackathon.certificate_image_url}
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg"
                  >
                    <Download className="w-4 h-4" />
                    {t('hackathons.download_cert', { defaultValue: 'Download Certificate' })}
                  </a>
                )}
                {selectedCertHackathon.certificate_url && (
                  <a
                    href={selectedCertHackathon.certificate_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('hackathons.verify_cert', { defaultValue: 'Verify Credential' })}
                  </a>
                )}
                <button
                  onClick={() => setSelectedCertHackathon(null)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold border ${
                    dark
                      ? 'bg-white/5 border-white/15 text-gray-300 hover:bg-white/10'
                      : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {t('hackathons.close', { defaultValue: 'Close' })}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
