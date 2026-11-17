import { useState, useEffect } from 'react'
import { X, Image as ImageIcon, Award } from 'lucide-react'

function HackathonForm({ hackathon = null, onSave, onCancel, loading = false }) {
  const [formData, setFormData] = useState({
    title: '',
    organizer: '',
    event_date: '',
    location: 'Fez, Morocco',
    award: '',
    project_name: '',
    description: '',
    technologies: '',
    certificate_url: '',
    project_url: '',
    image_path: null,
    certificate_path: null,
  })
  const [eventImageFile, setEventImageFile] = useState(null)
  const [eventImagePreview, setEventImagePreview] = useState(null)
  const [certImageFile, setCertImageFile] = useState(null)
  const [certImagePreview, setCertImagePreview] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (hackathon) {
      setFormData({
        title: hackathon.title || '',
        organizer: hackathon.organizer || '',
        event_date: hackathon.event_date || '',
        location: hackathon.location || '',
        award: hackathon.award || '',
        project_name: hackathon.project_name || '',
        description: hackathon.description || '',
        technologies: Array.isArray(hackathon.technologies)
          ? hackathon.technologies.join(', ')
          : hackathon.technologies || '',
        certificate_url: hackathon.certificate_url || '',
        project_url: hackathon.project_url || '',
        image_path: hackathon.image_path || null,
        certificate_path: hackathon.certificate_path || null,
      })
      setEventImagePreview(hackathon.image_url || null)
      setCertImagePreview(hackathon.certificate_image_url || null)
    }
  }, [hackathon])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({ ...prev, [type]: 'File must be an image' }))
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'eventImage') {
        setEventImageFile(file)
        setEventImagePreview(reader.result)
      } else {
        setCertImageFile(file)
        setCertImagePreview(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!formData.title.trim()) newErrors.title = 'Hackathon title is required'
    if (!formData.organizer.trim()) newErrors.organizer = 'Organizer is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSave(formData, eventImageFile, certImageFile)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Hackathon Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 ${
              errors.title ? 'border-red-500/50' : 'border-white/10 focus:border-violet-400'
            } text-white placeholder-gray-400 focus:outline-none transition-all`}
            placeholder="e.g. Smart Campus AI Hackathon"
          />
          {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Organizer / Host *
          </label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 ${
              errors.organizer ? 'border-red-500/50' : 'border-white/10 focus:border-violet-400'
            } text-white placeholder-gray-400 focus:outline-none transition-all`}
            placeholder="e.g. Université Privée de Fès (UPF)"
          />
          {errors.organizer && <p className="mt-1 text-xs text-red-400">{errors.organizer}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Award / Rank */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Award / Rank
          </label>
          <input
            type="text"
            name="award"
            value={formData.award}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-violet-400 text-white placeholder-gray-400 focus:outline-none transition-all"
            placeholder="e.g. 1st Place 🏆 / Finalist"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Date / Year
          </label>
          <input
            type="text"
            name="event_date"
            value={formData.event_date}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-violet-400 text-white placeholder-gray-400 focus:outline-none transition-all"
            placeholder="e.g. March 2025"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-violet-400 text-white placeholder-gray-400 focus:outline-none transition-all"
            placeholder="e.g. Fez, Morocco"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Project Built
          </label>
          <input
            type="text"
            name="project_name"
            value={formData.project_name}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-violet-400 text-white placeholder-gray-400 focus:outline-none transition-all"
            placeholder="e.g. EduPulse AI"
          />
        </div>

        {/* Technologies */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Technologies (comma-separated)
          </label>
          <input
            type="text"
            name="technologies"
            value={formData.technologies}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-violet-400 text-white placeholder-gray-400 focus:outline-none transition-all"
            placeholder="React, Python, Supabase, Tailwind CSS"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-white mb-1.5">
          Description & Achievements *
        </label>
        <textarea
          name="description"
          rows={3}
          value={formData.description}
          onChange={handleInputChange}
          className={`w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 ${
            errors.description ? 'border-red-500/50' : 'border-white/10 focus:border-violet-400'
          } text-white placeholder-gray-400 focus:outline-none transition-all resize-none`}
          placeholder="Describe what your team built, the problem solved, and your achievement..."
        />
        {errors.description && <p className="mt-1 text-xs text-red-400">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Project / Repo URL */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Project / GitHub URL
          </label>
          <input
            type="url"
            name="project_url"
            value={formData.project_url}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-violet-400 text-white placeholder-gray-400 focus:outline-none transition-all"
            placeholder="https://github.com/radouane99/..."
          />
        </div>

        {/* Certificate Verification URL */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Certificate Verification Link (optional)
          </label>
          <input
            type="url"
            name="certificate_url"
            value={formData.certificate_url}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border-2 border-white/10 focus:border-violet-400 text-white placeholder-gray-400 focus:outline-none transition-all"
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Image Uploads: Event Cover & Certificate Image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Event Photo */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Hackathon / Team Photo
          </label>
          {eventImagePreview ? (
            <div className="relative">
              <img
                src={eventImagePreview}
                alt="Event Preview"
                className="w-full h-40 object-cover rounded-xl border border-white/15 bg-white/5"
              />
              <button
                type="button"
                onClick={() => {
                  setEventImageFile(null)
                  setEventImagePreview(null)
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-target flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer">
              <ImageIcon className="w-8 h-8 text-gray-400 mb-1.5" />
              <span className="text-xs text-gray-300 font-medium">Upload Hackathon Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'eventImage')}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Certificate Image */}
        <div>
          <label className="block text-sm font-semibold text-white mb-1.5">
            Certificate Image (Diplôme / Attestation)
          </label>
          {certImagePreview ? (
            <div className="relative">
              <img
                src={certImagePreview}
                alt="Certificate Preview"
                className="w-full h-40 object-contain rounded-xl border border-white/15 bg-white/5"
              />
              <button
                type="button"
                onClick={() => {
                  setCertImageFile(null)
                  setCertImagePreview(null)
                }}
                className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-600/80 text-white hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label className="cursor-target flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-violet-400/30 rounded-xl bg-violet-500/5 hover:bg-violet-500/10 transition-all cursor-pointer">
              <Award className="w-8 h-8 text-violet-400 mb-1.5" />
              <span className="text-xs text-violet-300 font-medium">Upload Certificate Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileChange(e, 'certImage')}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-violet-500/25 transition-all disabled:opacity-50"
        >
          {loading ? 'Saving...' : hackathon ? 'Update Hackathon' : 'Add Hackathon'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

export default HackathonForm
