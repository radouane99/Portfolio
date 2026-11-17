import { supabase } from '../lib/supabase'
import { uploadImage, deleteImage, getImageUrl, STORAGE_BUCKETS } from '../lib/storage'

/**
 * Get all projects with their technologies
 * @returns {Promise<{data: Array, error: Error|null}>}
 */
export async function getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        projects_technologies (
          technology:technologies (*)
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Transform data to include technologies array and image URLs
    const projectsWithUrls = data.map((project) => {
      const technologies = (project.projects_technologies || []).map(
        (pt) => {
          const tech = pt.technology
          return {
            ...tech,
            image_url: tech?.image_path
              ? getImageUrl(STORAGE_BUCKETS.TECHNOLOGIES, tech.image_path)
              : null,
          }
        }
      )

      const galleryUrls = Array.isArray(project.gallery_paths)
        ? project.gallery_paths.map((path) =>
            getImageUrl(STORAGE_BUCKETS.PROJECTS, path)
          )
        : []

      return {
        ...project,
        technologies: technologies,
        technologies_names: technologies.map((t) => t.name),
        image_url: project.image_path
          ? getImageUrl(STORAGE_BUCKETS.PROJECTS, project.image_path)
          : null,
        gallery_urls: galleryUrls,
        // Remove the junction table data from response
        projects_technologies: undefined,
      }
    })

    return { data: projectsWithUrls, error: null }
  } catch (error) {
    console.error('Error fetching projects, using fallback:', error)
    
    // Robust fallback data for when Supabase is unreachable
    const fallbackProjects = [
      {
        id: 'fallback-1',
        title: 'Project Management System',
        description: 'A high-performance task management platform with real-time collaboration.',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        technologies: [
          { name: 'React', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg' },
          { name: 'Node.js', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original.svg' },
          { name: 'Tailwind CSS', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg' }
        ],
        category: 'fullstack',
        status: 'completed',
        year: '2024',
        github_url: 'https://github.com/radouane99',
        live_url: '#'
      },
      {
        id: 'fallback-2',
        title: 'AI Content Generator',
        description: 'Advanced AI-powered content creation tool utilizing large language models.',
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        technologies: [
          { name: 'Python', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/python/python-original.svg' },
          { name: 'TensorFlow', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/tensorflow/tensorflow-original.svg' },
          { name: 'Next.js', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg' }
        ],
        category: 'ai',
        status: 'completed',
        year: '2024',
        github_url: 'https://github.com/radouane99',
        live_url: '#'
      },
      {
        id: 'fallback-3',
        title: 'E-commerce Analytics',
        description: 'Real-time data visualization dashboard for tracking sales and user behavior.',
        image_url: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=800',
        technologies: [
          { name: 'TypeScript', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg' },
          { name: 'D3.js', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/d3js/d3js-original.svg' },
          { name: 'PostgreSQL', image_url: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original.svg' }
        ],
        category: 'data',
        status: 'completed',
        year: '2023',
        github_url: 'https://github.com/radouane99',
        live_url: '#'
      }
    ];

    return { data: fallbackProjects, error: null }
  }
}

/**
 * Get a single project by ID with technologies
 * @param {string} id - Project ID
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function getProjectById(id) {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        projects_technologies (
          technology:technologies (*)
        )
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    const technologies = (data.projects_technologies || []).map(
      (pt) => {
        const tech = pt.technology
        return {
          ...tech,
          image_url: tech?.image_path
            ? getImageUrl(STORAGE_BUCKETS.TECHNOLOGIES, tech.image_path)
            : null,
        }
      }
    )

    const galleryUrls = Array.isArray(data.gallery_paths)
      ? data.gallery_paths.map((path) =>
          getImageUrl(STORAGE_BUCKETS.PROJECTS, path)
        )
      : []

    const projectWithUrl = {
      ...data,
      technologies: technologies,
      technologies_names: technologies.map((t) => t.name),
      image_url: data.image_path
        ? getImageUrl(STORAGE_BUCKETS.PROJECTS, data.image_path)
        : null,
      gallery_urls: galleryUrls,
      projects_technologies: undefined,
    }

    return { data: projectWithUrl, error: null }
  } catch (error) {
    console.error('Error fetching project, checking fallback:', error)
    const fallbackMap = {
      'p1': {
        id: 'p1',
        title: 'Modern E-Commerce Platform',
        tagline: 'Full-featured online shopping experience with secure payments and real-time inventory.',
        description: 'A scalable full-stack e-commerce platform designed for high conversion and seamless checkout experiences.\n\nIncludes real-time inventory synchronization, role-based admin analytics, and secure Stripe payment processing.',
        features: ['Secure Payment Gateway', 'Real-time Inventory Management', 'Admin Analytics Dashboard', 'Responsive Mobile-First UI'],
        duration: '3 Months',
        team_size: 'Solo / Full-Stack',
        role: 'Full-Stack Developer',
        challenges: 'Handling concurrent inventory updates during flash sales without race conditions.',
        solutions: 'Implemented transactional database locks and optimistic UI updates.',
        image_url: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=1000',
        gallery_urls: [],
        technologies: [{ name: 'React' }, { name: 'Node.js' }, { name: 'Tailwind CSS' }, { name: 'Stripe' }],
        category: 'fullstack',
        github_url: 'https://github.com/radouane99',
        live_url: '#',
        created_at: '2024-05-01T10:00:00Z'
      },
      'fallback-1': {
        id: 'fallback-1',
        title: 'Project Management System',
        tagline: 'High-performance task management platform with real-time collaboration.',
        description: 'A modern project and task management platform built for agile engineering teams.\n\nFeatures Kanban boards, sprint tracking, automated notifications, and real-time team updates.',
        features: ['Interactive Kanban Boards', 'Real-time Collaboration', 'Role-Based Access Control', 'Automated Sprint Reports'],
        duration: '4 Months',
        team_size: '2 Developers',
        role: 'Lead Full-Stack Developer',
        challenges: 'Synchronizing board state across multiple connected team members in real time.',
        solutions: 'Used Supabase Realtime subscriptions and optimistic state updates in React.',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        gallery_urls: [],
        technologies: [{ name: 'React' }, { name: 'Node.js' }, { name: 'Tailwind CSS' }, { name: 'Supabase' }],
        category: 'fullstack',
        github_url: 'https://github.com/radouane99',
        live_url: '#',
        created_at: '2024-06-15T10:00:00Z'
      },
      'p2': {
        id: 'p2',
        title: 'AI Portfolio & Content Builder',
        tagline: 'Intelligent SaaS platform that generates professional portfolios and content using AI.',
        description: 'An AI-powered SaaS platform leveraging Large Language Models to help developers and creators generate tailored content, portfolios, and SEO-optimized copy in seconds.',
        features: ['AI Content Generation', 'Live Theme Customizer', 'One-Click Export', 'Multi-language Support'],
        duration: '2 Months',
        team_size: 'Solo Developer',
        role: 'Full-Stack & AI Engineer',
        challenges: 'Keeping LLM latency low while streaming structured JSON layouts.',
        solutions: 'Built Edge Functions with streaming responses and client-side schema validation.',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000',
        gallery_urls: [],
        technologies: [{ name: 'Next.js' }, { name: 'TypeScript' }, { name: 'Supabase' }, { name: 'AI API' }],
        category: 'AI/ML',
        github_url: 'https://github.com/radouane99',
        live_url: '#',
        created_at: '2024-08-10T10:00:00Z'
      },
      'fallback-2': {
        id: 'fallback-2',
        title: 'AI Content Generator',
        tagline: 'Advanced AI-powered content creation tool utilizing large language models.',
        description: 'An AI-powered SaaS platform leveraging Large Language Models to help developers and creators generate tailored content and SEO-optimized copy in seconds.',
        features: ['Prompt Templates', 'Real-time Streaming', 'Export to Markdown/PDF', 'Usage Analytics'],
        duration: '2 Months',
        team_size: 'Solo Developer',
        role: 'Full-Stack & AI Developer',
        image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        gallery_urls: [],
        technologies: [{ name: 'Python' }, { name: 'Next.js' }, { name: 'Tailwind CSS' }],
        category: 'AI/ML',
        github_url: 'https://github.com/radouane99',
        live_url: '#',
        created_at: '2024-08-10T10:00:00Z'
      },
      'p3': {
        id: 'p3',
        title: 'Real-Time Analytics Dashboard',
        tagline: 'Advanced data visualization dashboard processing events in real time.',
        description: 'Interactive business intelligence and analytics dashboard designed to visualize key performance indicators, user retention, and conversion funnels.',
        features: ['Interactive D3.js Charts', 'Custom Date Filtering', 'Automated CSV/PDF Reports', 'Dark/Light Mode'],
        duration: '3 Months',
        team_size: '3 Members',
        role: 'Frontend & Data Visualization Engineer',
        image_url: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=1000',
        gallery_urls: [],
        technologies: [{ name: 'React' }, { name: 'D3.js' }, { name: 'PostgreSQL' }],
        category: 'data',
        github_url: 'https://github.com/radouane99',
        live_url: '#',
        created_at: '2023-11-20T10:00:00Z'
      },
      'fallback-3': {
        id: 'fallback-3',
        title: 'E-commerce Analytics',
        tagline: 'Real-time data visualization dashboard for tracking sales and user behavior.',
        description: 'Interactive business intelligence and analytics dashboard designed to visualize key performance indicators, user retention, and conversion funnels.',
        features: ['Interactive Charts', 'Custom Date Filtering', 'Automated Reports', 'PostgreSQL Aggregation'],
        duration: '3 Months',
        team_size: '2 Members',
        role: 'Full-Stack Developer',
        image_url: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=800',
        gallery_urls: [],
        technologies: [{ name: 'TypeScript' }, { name: 'D3.js' }, { name: 'PostgreSQL' }],
        category: 'data',
        github_url: 'https://github.com/radouane99',
        live_url: '#',
        created_at: '2023-11-20T10:00:00Z'
      }
    }

    if (fallbackMap[id]) {
      return { data: fallbackMap[id], error: null }
    }
    return { data: null, error }
  }
}

/**
 * Create a new project
 * @param {Object} projectData - Project data (includes technologyIds array)
 * @param {File|null} imageFile - Optional image file to upload
 * @param {File[]|null} galleryFiles - Optional additional images for gallery
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function createProject(projectData, imageFile = null, galleryFiles = []) {
  try {
    let imagePath = null
    let galleryPaths = []

    // Upload image if provided
    if (imageFile) {
      const uploadResult = await uploadImage(
        imageFile,
        STORAGE_BUCKETS.PROJECTS,
        'images'
      )
      if (uploadResult.error) {
        throw uploadResult.error
      }
      imagePath = uploadResult.path
    }

    // Upload gallery images if provided
    if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
      for (const file of galleryFiles) {
        if (!file) continue
        const uploadResult = await uploadImage(
          file,
          STORAGE_BUCKETS.PROJECTS,
          'gallery'
        )
        if (uploadResult.error) {
          // If any gallery upload fails, clean up previous uploads
          if (imagePath) {
            await deleteImage(STORAGE_BUCKETS.PROJECTS, imagePath)
          }
          for (const path of galleryPaths) {
            await deleteImage(STORAGE_BUCKETS.PROJECTS, path)
          }
          throw uploadResult.error
        }
        galleryPaths.push(uploadResult.path)
      }
    }

    // Insert project into database
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert([
        {
          title: projectData.title,
          description: projectData.description,
          tagline: projectData.tagline || null,
          features: Array.isArray(projectData.features) && projectData.features.length > 0
            ? projectData.features
            : null,
          duration: projectData.duration || null,
          team_size: projectData.team_size || null,
          role: projectData.role || null,
          challenges: projectData.challenges || null,
          solutions: projectData.solutions || null,
          image_path: imagePath,
          category: projectData.category,
          github_url: projectData.github_url || null,
          live_url: projectData.live_url || null,
          gallery_paths: galleryPaths.length > 0 ? galleryPaths : null,
        },
      ])
      .select()
      .single()

    if (projectError) {
      // If database insert fails, delete uploaded image
      if (imagePath) {
        await deleteImage(STORAGE_BUCKETS.PROJECTS, imagePath)
      }
      if (galleryPaths.length > 0) {
        for (const path of galleryPaths) {
          await deleteImage(STORAGE_BUCKETS.PROJECTS, path)
        }
      }
      throw projectError
    }

    // Link technologies if provided
    if (projectData.technologyIds && projectData.technologyIds.length > 0) {
      const projectTechnologies = projectData.technologyIds.map((techId) => ({
        project_id: project.id,
        technology_id: techId,
      }))

      const { error: linkError } = await supabase
        .from('projects_technologies')
        .insert(projectTechnologies)

      if (linkError) {
        // If linking fails, delete the project
        await supabase.from('projects').delete().eq('id', project.id)
        if (imagePath) {
          await deleteImage(STORAGE_BUCKETS.PROJECTS, imagePath)
        }
        throw linkError
      }
    }

    // Fetch the complete project with technologies
    const { data: completeProject } = await getProjectById(project.id)

    return { data: completeProject, error: null }
  } catch (error) {
    console.error('Error creating project:', error)
    return { data: null, error }
  }
}

/**
 * Update an existing project
 * @param {string} id - Project ID
 * @param {Object} projectData - Updated project data
 * @param {File|null} imageFile - Optional new image file to upload
 * @param {boolean} deleteOldImage - Whether to delete old image
 * @param {File[]|null} galleryFiles - Optional new gallery images (replaces existing)
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export async function updateProject(
  id,
  projectData,
  imageFile = null,
  deleteOldImage = false,
  galleryFiles = []
) {
  try {
    // Get current project to access old image and gallery paths
    const { data: currentProject } = await getProjectById(id)
    const oldImagePath = currentProject?.image_path
    const oldGalleryPaths = Array.isArray(currentProject?.gallery_paths)
      ? currentProject.gallery_paths
      : []

    let imagePath = projectData.image_path || oldImagePath
    let galleryPaths = oldGalleryPaths

    // Upload new image if provided
    if (imageFile) {
      const uploadResult = await uploadImage(
        imageFile,
        STORAGE_BUCKETS.PROJECTS,
        'images'
      )
      if (uploadResult.error) {
        throw uploadResult.error
      }
      imagePath = uploadResult.path

      // Delete old image if it exists and deleteOldImage is true
      if (deleteOldImage && oldImagePath) {
        await deleteImage(STORAGE_BUCKETS.PROJECTS, oldImagePath)
      }
    }

    // If new gallery files are provided, replace existing gallery
    if (Array.isArray(galleryFiles) && galleryFiles.length > 0) {
      const newGalleryPaths = []
      for (const file of galleryFiles) {
        if (!file) continue
        const uploadResult = await uploadImage(
          file,
          STORAGE_BUCKETS.PROJECTS,
          'gallery'
        )
        if (uploadResult.error) {
          // Clean up any newly uploaded gallery images
          for (const path of newGalleryPaths) {
            await deleteImage(STORAGE_BUCKETS.PROJECTS, path)
          }
          throw uploadResult.error
        }
        newGalleryPaths.push(uploadResult.path)
      }

      // Delete old gallery images
      if (oldGalleryPaths.length > 0) {
        for (const path of oldGalleryPaths) {
          await deleteImage(STORAGE_BUCKETS.PROJECTS, path)
        }
      }

      galleryPaths = newGalleryPaths
    }

    // Update project in database
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .update({
        title: projectData.title,
        description: projectData.description,
        tagline: projectData.tagline || null,
        features: Array.isArray(projectData.features) && projectData.features.length > 0
          ? projectData.features
          : null,
        duration: projectData.duration || null,
        team_size: projectData.team_size || null,
        role: projectData.role || null,
        challenges: projectData.challenges || null,
        solutions: projectData.solutions || null,
        image_path: imagePath,
        category: projectData.category,
        github_url: projectData.github_url || null,
        live_url: projectData.live_url || null,
        gallery_paths: galleryPaths.length > 0 ? galleryPaths : null,
      })
      .eq('id', id)
      .select()
      .single()

    if (projectError) {
      // If database update fails and we uploaded a new image, delete it
      if (imageFile && imagePath !== oldImagePath) {
        await deleteImage(STORAGE_BUCKETS.PROJECTS, imagePath)
      }
      throw projectError
    }

    // Update technology links if provided
    if (projectData.technologyIds !== undefined) {
      // Delete existing links
      await supabase
        .from('projects_technologies')
        .delete()
        .eq('project_id', id)

      // Insert new links if any
      if (projectData.technologyIds && projectData.technologyIds.length > 0) {
        const projectTechnologies = projectData.technologyIds.map((techId) => ({
          project_id: id,
          technology_id: techId,
        }))

        const { error: linkError } = await supabase
          .from('projects_technologies')
          .insert(projectTechnologies)

        if (linkError) {
          throw linkError
        }
      }
    }

    // Fetch the complete project with technologies
    const { data: completeProject } = await getProjectById(id)

    return { data: completeProject, error: null }
  } catch (error) {
    console.error('Error updating project:', error)
    return { data: null, error }
  }
}

/**
 * Delete a project
 * @param {string} id - Project ID
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export async function deleteProject(id) {
  try {
    // Get project to access image path
    const { data: project } = await getProjectById(id)

    // Delete from database
    const { error } = await supabase.from('projects').delete().eq('id', id)

    if (error) throw error

    // Delete image from storage if it exists
    if (project?.image_path) {
      await deleteImage(STORAGE_BUCKETS.PROJECTS, project.image_path)
    }

    return { success: true, error: null }
  } catch (error) {
    console.error('Error deleting project:', error)
    return { success: false, error }
  }
}

