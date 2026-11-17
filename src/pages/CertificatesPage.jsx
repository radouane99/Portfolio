import { useState, useEffect } from 'react'
import { Award, Calendar, ExternalLink, Download, Trophy, Eye, X, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

import { getCertificates } from '../services/certificatesService'
import { getHackathons } from '../services/hackathonsService'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useTheme } from '../contexts/ThemeContext'
import istqbLogo from '../assets/img/ISTQB.png'

function CertificatesPage() {
  const [certificates, setCertificates] = useState([])
  const [hackathons, setHackathons] = useState([])
  const [activeTab, setActiveTab] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isDarkMode: dark } = useTheme()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const [certRes, hackRes] = await Promise.all([
        getCertificates(),
        getHackathons(),
      ])
      setCertificates(certRes.data || [])
      setHackathons(hackRes.data || [])
      setLoading(false)
    }

    fetchAll()
  }, [])

  const combinedItems = [
    ...certificates.map((c) => ({
      id: `cert-${c.id}`,
      type: 'certificate',
      title: c.title,
      subtitle: 'Official Certification',
      image_url: c.image_url || (c.title?.toLowerCase().includes('istqb') ? istqbLogo : null),
      verify_url: c.show_url,
      date: c.created_at
        ? new Date(c.created_at).toLocaleDateString(i18n.language?.startsWith('fr') ? 'fr-FR' : 'en-US', {
            year: 'numeric',
            month: 'long',
          })
        : '2024',
    })),
    ...hackathons.map((h) => ({
      id: `hack-${h.id}`,
      type: 'hackathon',
      title: h.title,
      subtitle: `${h.organizer || 'Hackathon'} ${h.award ? `• ${h.award}` : ''}`,
      award: h.award,
      image_url: h.certificate_image_url || h.image_url,
      verify_url: h.certificate_url || h.project_url,
      date: h.event_date || '2024',
    })),
  ]

  const displayedItems =
    activeTab === 'all'
      ? combinedItems
      : combinedItems.filter((item) => item.type === activeTab)

  return (
    <div
      className={`min-h-screen relative font-sans antialiased ${
        dark ? 'bg-[#08080f] text-white' : 'bg-[#f8f7ff] text-gray-900'
      }`}
    >
      <Navbar />

      <div
        className="min-h-screen pt-32 pb-20 px-4 sm:px-6"
        style={
          dark
            ? { background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.12) 0%, transparent 60%), #08080f' }
            : { background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(139,92,246,0.06) 0%, transparent 60%), #f8f7ff' }
        }
      >
        <div className="max-w-7xl mx-auto">
          {/* Back button */}
          <div className="mb-8">
            <Link
              to="/"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-300 hover:-translate-x-1 ${
                dark
                  ? 'bg-white/5 border-white/10 text-violet-300 hover:border-violet-400'
                  : 'bg-white border-violet-200 text-violet-700 hover:bg-violet-50 shadow-sm'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              {t('certificates_page.back_home', { defaultValue: 'Back to Portfolio' })}
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="section-tag mb-5 inline-flex items-center gap-2">
              <Award className="w-3.5 h-3.5" />
              {t('certificates_page.badge', { defaultValue: 'Credentials & Awards' })}
            </div>

            <h1 className="font-head text-4xl md:text-6xl font-bold mb-5 leading-tight">
              {t('certificates_page.title_part1', { defaultValue: 'Certificates &' })}{' '}
              <span className="grad-text">{t('certificates_page.title_part2', { defaultValue: 'Hackathons' })}</span>
            </h1>

            <p className={`max-w-2xl mx-auto text-base md:text-lg leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}>
              {t('certificates_page.subtitle', {
                defaultValue: 'Verified professional certifications, academic credentials, and hackathon awards.',
              })}
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { id: 'all', label: t('certificates_page.tab_all', { defaultValue: 'All Credentials' }), icon: Award },
              { id: 'certificate', label: t('certificates_page.tab_certs', { defaultValue: 'Certifications' }), icon: Award },
              { id: 'hackathon', label: t('certificates_page.tab_hackathons', { defaultValue: 'Hackathon Awards' }), icon: Trophy },
            ].map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`cursor-target flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                    active
                      ? 'bg-gradient-to-r from-violet-500 to-pink-500 text-white border-transparent shadow-lg shadow-violet-500/25'
                      : dark
                        ? 'bg-white/5 border-white/10 text-gray-300 hover:border-violet-500/40'
                        : 'bg-white border-violet-200 text-gray-700 hover:border-violet-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-80 rounded-3xl animate-pulse border ${
                    dark ? 'bg-white/5 border-white/10' : 'bg-white border-violet-100'
                  }`}
                />
              ))}
            </div>
          ) : displayedItems.length === 0 ? (
            <div className="text-center py-20">
              <Award className={`w-16 h-16 mx-auto mb-4 ${dark ? 'text-gray-600' : 'text-gray-400'}`} />
              <h3 className="text-xl font-semibold mb-2">
                {t('certificates_page.empty_title', { defaultValue: 'No Certificates Found' })}
              </h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`cursor-target group relative rounded-3xl border overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2 ${
                    dark
                      ? 'bg-white/[0.04] border-white/10 hover:border-violet-500/40 hover:shadow-2xl hover:shadow-violet-500/15'
                      : 'bg-white border-violet-100 hover:border-violet-300 hover:shadow-2xl hover:shadow-violet-500/10'
                  }`}
                >
                  {/* Image Preview */}
                  <div className="relative h-56 overflow-hidden bg-black/10 flex items-center justify-center">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-contain p-3 transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-violet-400">
                        {item.type === 'hackathon' ? (
                          <Trophy className="w-16 h-16 mb-2 text-amber-400" />
                        ) : (
                          <Award className="w-16 h-16 mb-2" />
                        )}
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 right-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold shadow ${
                          item.type === 'hackathon'
                            ? 'bg-gradient-to-r from-amber-500 to-pink-500 text-white'
                            : 'bg-gradient-to-r from-violet-500 to-purple-600 text-white'
                        }`}
                      >
                        {item.award || (item.type === 'hackathon' ? 'Hackathon' : 'Certified')}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <p className={`text-xs font-semibold mb-1.5 ${dark ? 'text-violet-400' : 'text-violet-600'}`}>
                      {item.subtitle}
                    </p>
                    <h3 className="text-xl font-bold font-head mb-3 leading-snug">
                      {item.title}
                    </h3>

                    <div className={`flex items-center gap-2 text-xs mb-5 mt-auto ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Calendar className="w-4 h-4 text-violet-400" />
                      <span>{item.date}</span>
                    </div>

                    <div className={`flex gap-2.5 pt-4 border-t ${dark ? 'border-white/10' : 'border-violet-100'}`}>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="cursor-target flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:shadow-lg hover:shadow-violet-500/25 transition-all"
                      >
                        <Eye className="w-4 h-4" />
                        {t('certificates_page.preview', { defaultValue: 'Preview' })}
                      </button>

                      {item.verify_url && item.verify_url !== '#' && (
                        <a
                          href={item.verify_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`cursor-target inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ${
                            dark
                              ? 'bg-white/5 border-white/15 text-gray-200 hover:border-violet-400'
                              : 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100'
                          }`}
                        >
                          <ExternalLink className="w-4 h-4" />
                          {t('certificates_page.verify', { defaultValue: 'Verify' })}
                        </a>
                      )}

                      {item.image_url && (
                        <a
                          href={item.image_url}
                          download
                          className={`cursor-target p-2.5 rounded-xl border transition-all ${
                            dark
                              ? 'bg-white/5 border-white/15 text-gray-300 hover:text-white'
                              : 'bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-label="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-3xl w-full rounded-3xl border p-6 sm:p-8 shadow-2xl ${
                dark ? 'bg-[#0d0d1a] border-violet-500/30 text-white' : 'bg-white border-violet-200 text-gray-900'
              }`}
            >
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-2xl font-bold font-head mb-1">{selectedItem.title}</h3>
              <p className="text-sm text-violet-400 font-semibold mb-6">{selectedItem.subtitle}</p>

              {selectedItem.image_url && (
                <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/20 mb-6">
                  <img
                    src={selectedItem.image_url}
                    alt={selectedItem.title}
                    className="w-full max-h-[65vh] object-contain mx-auto"
                  />
                </div>
              )}

              <div className="flex justify-end gap-3">
                {selectedItem.verify_url && (
                  <a
                    href={selectedItem.verify_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-500 to-pink-500 text-white"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {t('certificates_page.verify', { defaultValue: 'Verify' })}
                  </a>
                )}
                <button
                  onClick={() => setSelectedItem(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-white/15"
                >
                  {t('hackathons.close', { defaultValue: 'Close' })}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  )
}

export default CertificatesPage
