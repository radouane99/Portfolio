import { supabase } from '../lib/supabase'
import { uploadImage, deleteImage, getImageUrl, STORAGE_BUCKETS } from '../lib/storage'
import nasaSpaceAppsCert from '../assets/img/nasa-space-apps-2026.jpg'
import gemmaCert from '../assets/img/build-with-gemma-2026.jpg'
import rallyIaCert from '../assets/img/rally-ia-2026.jpg'

const LOCAL_STORAGE_KEY = 'portfolio_hackathons_v3'

export const DEFAULT_HACKATHONS = [
  {
    id: 'hack-nasa-2026',
    title: '2026 NASA Space Apps Challenge',
    organizer: 'NASA — National Aeronautics and Space Administration',
    event_date: 'November 14–15, 2026',
    location: 'Morocco / Global',
    award: 'Galactic Problem Solver 🚀',
    project_name: 'Earth & Space Observation Platform',
    description:
      'Awarded the Galactic Problem Solver certification by NASA (signed by Program Scientist Marc Kuchner) for outstanding participation and engineering efforts addressing complex challenges on Earth and in space.',
    technologies: ['Python', 'React', 'NASA Open APIs', 'Geospatial AI', 'Tailwind CSS'],
    image_url: nasaSpaceAppsCert,
    certificate_image_url: nasaSpaceAppsCert,
    certificate_url: '/certificates/nasa-space-apps-2026.jpg',
    project_url: 'https://github.com/radouane99',
    created_at: '2026-11-15T10:00:00Z',
  },
  {
    id: 'hack-gemma-2026',
    title: 'Build with Gemma Hackathon',
    organizer: 'GDGC ENSAB × Google Gemma Team × AI Crafters',
    event_date: 'July 26, 2026',
    location: 'Technopark Casablanca, Morocco',
    award: '1st Place Winner 🏆 & Certified',
    project_name: 'Gemma Open-Weight AI Solution',
    description:
      'Collaborated on developing high-efficiency AI solutions powered by Google Gemma lightweight open-weight models at Technopark Casablanca, recognized for technical excellence, innovation, and teamwork.',
    technologies: ['Google Gemma', 'Python', 'Open-Weight LLMs', 'React', 'FastAPI'],
    image_url: gemmaCert,
    certificate_image_url: gemmaCert,
    certificate_url: '/certificates/build-with-gemma-2026.pdf',
    project_url: 'https://github.com/radouane99',
    created_at: '2026-07-26T10:00:00Z',
  },
  {
    id: 'hack-rallyia-2026',
    title: 'Rally IA Future Lab (RallyIA Hackathon)',
    organizer: 'Ministry of Digital Transition • AI Made in Morocco',
    event_date: 'June 16–20, 2026',
    location: 'Merzouga, Morocco',
    award: 'National AI Talent 🇲🇦',
    project_name: 'Sovereign AI & Smart Public Services',
    description:
      'Selected participant in the national Rally IA Future Lab hackathon held under High Royal Patronage in Merzouga, prototyping sovereign "AI Made in Morocco" solutions alongside top national engineers and researchers.',
    technologies: ['Artificial Intelligence', 'LLMs & RAG', 'Python', 'React', 'Supabase'],
    image_url: rallyIaCert,
    certificate_image_url: rallyIaCert,
    certificate_url: '/certificates/rally-ia-2026.jpg',
    project_url: 'https://github.com/radouane99',
    created_at: '2026-06-20T10:00:00Z',
  },
]

function getLocalHackathons() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.warn('Error reading local hackathons:', e)
  }
  return DEFAULT_HACKATHONS
}

function saveLocalHackathons(list) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    console.warn('Error saving local hackathons:', e)
  }
}

function formatHackathonRecord(record) {
  return {
    ...record,
    technologies: Array.isArray(record.technologies)
      ? record.technologies
      : typeof record.technologies === 'string' && record.technologies.trim()
        ? record.technologies.split(',').map((t) => t.trim()).filter(Boolean)
        : [],
    image_url:
      record.image_url ||
      (record.image_path ? getImageUrl(STORAGE_BUCKETS.HACKATHONS, record.image_path) : null),
    certificate_image_url:
      record.certificate_image_url ||
      (record.certificate_path
        ? getImageUrl(STORAGE_BUCKETS.HACKATHONS, record.certificate_path)
        : null),
  }
}

/**
 * Get all hackathons
 */
export async function getHackathons() {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    if (data && data.length > 0) {
      const formatted = data.map(formatHackathonRecord)
      const existingTitles = new Set(formatted.map((h) => h.title?.toLowerCase()))
      const merged = [
        ...formatted,
        ...DEFAULT_HACKATHONS.filter((d) => !existingTitles.has(d.title.toLowerCase())),
      ]
      saveLocalHackathons(merged)
      return { data: merged, error: null }
    }

    return { data: getLocalHackathons(), error: null }
  } catch (error) {
    console.warn('Using fallback/local hackathons:', error?.message || error)
    return { data: getLocalHackathons(), error: null }
  }
}

/**
 * Get a single hackathon by ID
 */
export async function getHackathonById(id) {
  try {
    const { data, error } = await supabase
      .from('hackathons')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return { data: formatHackathonRecord(data), error: null }
  } catch (error) {
    const local = getLocalHackathons().find((h) => h.id === id) || null
    return { data: local, error: local ? null : error }
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve) => {
    if (!file) return resolve(null)
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result)
    reader.onerror = () => resolve(null)
    reader.readAsDataURL(file)
  })
}

/**
 * Create a new hackathon
 */
export async function createHackathon(hackathonData, eventImageFile = null, certImageFile = null) {
  let imagePath = null
  let certPath = null

  try {
    if (eventImageFile) {
      const uploadRes = await uploadImage(eventImageFile, STORAGE_BUCKETS.HACKATHONS, 'hackathons')
      if (!uploadRes.error) imagePath = uploadRes.path
    }

    if (certImageFile) {
      const certRes = await uploadImage(
        certImageFile,
        STORAGE_BUCKETS.HACKATHONS,
        'hackathon-certificates'
      )
      if (!certRes.error) certPath = certRes.path
    }

    const technologiesArray = Array.isArray(hackathonData.technologies)
      ? hackathonData.technologies
      : (hackathonData.technologies || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    const payload = {
      title: hackathonData.title,
      organizer: hackathonData.organizer,
      event_date: hackathonData.event_date || null,
      location: hackathonData.location || null,
      award: hackathonData.award || null,
      project_name: hackathonData.project_name || null,
      description: hackathonData.description,
      technologies: technologiesArray,
      image_path: imagePath,
      certificate_path: certPath,
      certificate_url: hackathonData.certificate_url || null,
      project_url: hackathonData.project_url || null,
    }

    const { data, error } = await supabase
      .from('hackathons')
      .insert([payload])
      .select()
      .single()

    if (error) throw error

    const formatted = formatHackathonRecord(data)
    const current = getLocalHackathons()
    saveLocalHackathons([formatted, ...current])
    return { data: formatted, error: null }
  } catch (error) {
    console.warn('Supabase hackathon insert failed, saving to local storage fallback:', error)
    const eventDataUrl = await fileToDataUrl(eventImageFile)
    const certDataUrl = await fileToDataUrl(certImageFile)
    const technologiesArray = Array.isArray(hackathonData.technologies)
      ? hackathonData.technologies
      : (hackathonData.technologies || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    const newRecord = formatHackathonRecord({
      id: `hack-${Date.now()}`,
      ...hackathonData,
      technologies: technologiesArray,
      image_path: imagePath,
      certificate_path: certPath,
      image_url: eventDataUrl || certDataUrl || hackathonData.image_url || nasaSpaceAppsCert,
      certificate_image_url:
        certDataUrl || eventDataUrl || hackathonData.certificate_image_url || null,
      created_at: new Date().toISOString(),
    })

    const current = getLocalHackathons()
    saveLocalHackathons([newRecord, ...current])
    return { data: newRecord, error: null }
  }
}

/**
 * Update an existing hackathon
 */
export async function updateHackathon(
  id,
  hackathonData,
  eventImageFile = null,
  certImageFile = null
) {
  try {
    const { data: currentHackathon } = await getHackathonById(id)
    let imagePath = hackathonData.image_path ?? currentHackathon?.image_path ?? null
    let certPath = hackathonData.certificate_path ?? currentHackathon?.certificate_path ?? null

    if (eventImageFile) {
      const uploadRes = await uploadImage(eventImageFile, STORAGE_BUCKETS.HACKATHONS, 'hackathons')
      if (!uploadRes.error) {
        if (currentHackathon?.image_path) {
          await deleteImage(STORAGE_BUCKETS.HACKATHONS, currentHackathon.image_path)
        }
        imagePath = uploadRes.path
      }
    }

    if (certImageFile) {
      const certRes = await uploadImage(
        certImageFile,
        STORAGE_BUCKETS.HACKATHONS,
        'hackathon-certificates'
      )
      if (!certRes.error) {
        if (currentHackathon?.certificate_path) {
          await deleteImage(STORAGE_BUCKETS.HACKATHONS, currentHackathon.certificate_path)
        }
        certPath = certRes.path
      }
    }

    const technologiesArray = Array.isArray(hackathonData.technologies)
      ? hackathonData.technologies
      : (hackathonData.technologies || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    const payload = {
      title: hackathonData.title,
      organizer: hackathonData.organizer,
      event_date: hackathonData.event_date || null,
      location: hackathonData.location || null,
      award: hackathonData.award || null,
      project_name: hackathonData.project_name || null,
      description: hackathonData.description,
      technologies: technologiesArray,
      image_path: imagePath,
      certificate_path: certPath,
      certificate_url: hackathonData.certificate_url || null,
      project_url: hackathonData.project_url || null,
    }

    const { data, error } = await supabase
      .from('hackathons')
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    const formatted = formatHackathonRecord(data)
    const updatedList = getLocalHackathons().map((h) => (h.id === id ? formatted : h))
    saveLocalHackathons(updatedList)
    return { data: formatted, error: null }
  } catch (error) {
    console.warn('Supabase hackathon update failed, updating local storage fallback:', error)
    const eventDataUrl = await fileToDataUrl(eventImageFile)
    const certDataUrl = await fileToDataUrl(certImageFile)
    const technologiesArray = Array.isArray(hackathonData.technologies)
      ? hackathonData.technologies
      : (hackathonData.technologies || '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)

    let updatedItem = null
    const updatedList = getLocalHackathons().map((h) => {
      if (h.id !== id) return h
      updatedItem = formatHackathonRecord({
        ...h,
        ...hackathonData,
        technologies: technologiesArray,
        image_url: eventDataUrl || hackathonData.image_url || h.image_url,
        certificate_image_url:
          certDataUrl || hackathonData.certificate_image_url || h.certificate_image_url,
      })
      return updatedItem
    })
    saveLocalHackathons(updatedList)
    return { data: updatedItem, error: null }
  }
}

/**
 * Delete a hackathon
 */
export async function deleteHackathon(id) {
  try {
    const { data: currentHackathon } = await getHackathonById(id)
    const { error } = await supabase.from('hackathons').delete().eq('id', id)
    if (error) throw error

    if (currentHackathon?.image_path) {
      await deleteImage(STORAGE_BUCKETS.HACKATHONS, currentHackathon.image_path)
    }
    if (currentHackathon?.certificate_path) {
      await deleteImage(STORAGE_BUCKETS.HACKATHONS, currentHackathon.certificate_path)
    }
  } catch (error) {
    console.warn('Supabase delete fallback to local storage:', error)
  }

  const filtered = getLocalHackathons().filter((h) => h.id !== id)
  saveLocalHackathons(filtered)
  return { success: true, error: null }
}
