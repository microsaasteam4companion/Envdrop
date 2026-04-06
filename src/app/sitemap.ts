import { MetadataRoute } from 'next'
import { blogData } from '@/data/blogs'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://envdrop.entrext.com'
  
  // Static routes
  const staticRoutes = [
    '',
    '/login',
    '/dashboard',
    '/blogs',
    '/legal/privacy',
    '/legal/terms',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic blog routes
  const blogRoutes = blogData.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
  
  return [...staticRoutes, ...blogRoutes]
}
