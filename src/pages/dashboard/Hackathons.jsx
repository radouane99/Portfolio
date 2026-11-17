import { useState, useEffect } from 'react'
import { Trophy, Calendar, MapPin, Plus, Edit, Trash2, X, Award, ExternalLink } from 'lucide-react'
import {
  getHackathons,
  createHackathon,
  updateHackathon,
  deleteHackathon,
} from '../../services/hackathonsService'
import HackathonForm from '../../components/dashboard/HackathonForm'
import { useTheme } from '../../contexts/ThemeContext'

function Hackathons() {
  const [hackathons, setHackathons] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingHackathon, setEditingHackathon] = useState(null)
  const [formLoading, setFormLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [hackathonToDelete, setHackathonToDelete] = useState(null)
  const { isDarkMode } = useTheme()

  useEffect(() => {
    loadHackathons()
  }, [])

  const loadHackathons = async () => {
    setLoading(true)
    setError(null)
    const { data, error: fetchError } = await getHackathons()
    if (fetchError) {
      setError('Failed to load hackathons')
    } else {
      setHackathons(data || [])
    }
    setLoading(false)
  }

  const handleCreate = () => {
    setEditingHackathon(null)
    setShowForm(true)
    setError(null)
  }

  const handleEdit = (hackathon) => {
    setEditingHackathon(hackathon)
    setShowForm(true)
    setError(null)
  }

  const handleDeleteClick = (hackathon) => {
    setHackathonToDelete(hackathon)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!hackathonToDelete) return
    setError(null)
    const { error: deleteError } = await deleteHackathon(hackathonToDelete.id)
    if (deleteError) {
      setError('Failed to delete hackathon')
    } else {
      await loadHackathons()
    }
    setShowDeleteConfirm(false)
    setHackathonToDelete(null)
  }

  const handleSave = async (formData, eventImageFile, certImageFile) => {
    setFormLoading(true)
    setError(null)
    try {
      if (editingHackathon) {
        const { error: updateError } = await updateHackathon(
          editingHackathon.id,
          formData,
          eventImageFile,
          certImageFile
        )
        if (updateError) {
          setError(`Failed to update hackathon: ${updateError.message || ''}`)
        } else {
          setShowForm(false)
          setEditingHackathon(null)
          await loadHackathons()
        }
      } else {
        const { error: createError } = await createHackathon(
          formData,
          eventImageFile,
          certImageFile
        )
        if (createError) {
          setError(`Failed to create hackathon: ${createError.message || ''}`)
        } else {
          setShowForm(false)
          await loadHackathons()
        }
      }
    } catch (err) {
      setError(`Unexpected error: ${err.message || ''}`)
    } finally {
      setFormLoading(false)
    }
  }

  if (loading) {
    return (
      <div className={`relative min-h-full flex items-center justify-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        <div className="text-lg">Loading hackathons...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-full">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteConfirm(false)} />
          <div className={`relative z-10 w-full max-w-md rounded-3xl p-6 shadow-2xl border ${
            isDarkMode ? 'bg-[#0d0d1a] border-red-500/30 text-white' : 'bg-white border-red-200 text-gray-900'
          }`}>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-500/20">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">Delete Hackathon</h3>
              <p className={`mt-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Are you sure you want to delete <strong>"{hackathonToDelete?.title}"</strong>?
              </p>
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 rounded-xl border border-gray-500/30 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2 px-4 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-400/30 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 sm:p-8 lg:p-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="w-10 h-0.5 bg-gradient-to-r from-violet-500 to-pink-500" />
                <span className={`text-xs font-bold tracking-widest uppercase ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                  Competitions & Awards
                </span>
              </div>
              <h1 className={`text-4xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                My Hackathons
              </h1>
              <p className={`text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Add and manage your hackathon participations, awards, and certificates
              </p>
            </div>
            {!showForm && (
              <button
                onClick={handleCreate}
                className="cursor-target flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Hackathon
              </button>
            )}
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl border bg-red-500/20 border-red-500/50 text-red-200">
              {error}
            </div>
          )}

          {/* Modal Form */}
          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="rounded-3xl border p-6 max-w-3xl w-full max-h-[92vh] overflow-y-auto bg-[#0d0d1a] border-white/15">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-2xl font-bold text-white">
                    {editingHackathon ? 'Edit Hackathon' : 'Add New Hackathon'}
                  </h2>
                  <button
                    onClick={() => setShowForm(false)}
                    className="p-2 rounded-xl text-white hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <HackathonForm
                  hackathon={editingHackathon}
                  onSave={handleSave}
                  onCancel={() => setShowForm(false)}
                  loading={formLoading}
                />
              </div>
            </div>
          )}

          {/* Grid */}
          {!showForm && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hackathons.map((hack) => (
                <div
                  key={hack.id}
                  className={`group relative rounded-3xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                    isDarkMode
                      ? 'bg-white/5 border-white/10 hover:border-violet-500/40'
                      : 'bg-white border-slate-200 hover:border-violet-300 shadow-sm'
                  }`}
                >
                  <div className="relative h-44 overflow-hidden bg-black/20">
                    {hack.image_url ? (
                      <img
                        src={hack.image_url}
                        alt={hack.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Trophy className="w-12 h-12 text-violet-400" />
                      </div>
                    )}
                    {hack.award && (
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-pink-500 text-white shadow">
                        {hack.award}
                      </span>
                    )}
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className={`text-lg font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {hack.title}
                    </h3>
                    <p className={`text-xs font-semibold mb-2 ${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>
                      {hack.organizer} {hack.event_date ? `• ${hack.event_date}` : ''}
                    </p>
                    <p className={`text-xs leading-relaxed mb-4 flex-1 line-clamp-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {hack.description}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        {hack.certificate_image_url && (
                          <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                            <Award className="w-3.5 h-3.5" /> Cert Attached
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(hack)}
                          className="p-2 rounded-xl bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 border border-violet-500/30"
                          aria-label="Edit hackathon"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(hack)}
                          className="p-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30"
                          aria-label="Delete hackathon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Hackathons
