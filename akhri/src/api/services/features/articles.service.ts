import { baseService } from '@/api/services/base.service'
import type { Article, CreateArticleDto, Video } from '../types'
import type { Ref } from 'vue'
import { ref } from 'vue'

// API service with proper types
export class ArticlesService {
  // Private reactive state
  private _articles: Ref<Article[]>
  private _loading: Ref<boolean>
  private _error: Ref<Error | null>

  constructor() {
    this._articles = ref<Article[]>([])
    this._loading = ref(false)
    this._error = ref<Error | null>(null)
  }

  // Public getters (controlled exposure)
  public get articles(): Ref<Article[]> {
    return this._articles
  }

  public get loading(): Ref<boolean> {
    return this._loading
  }

  public get error(): Ref<Error | null> {
    return this._error
  }

  // Private helper methods (internal logic)

  private setLoading(state: boolean): void {
    this._loading.value = state
  }

  private clearError(): void {
    this._error.value = null
  }

  async getHeadlines(): Promise<Article[]> {
    // const response = await api.get('/articles/headlines')
    // return rese.dataspon
    return {
      title: 'The Rise of AI in Modern Healthcare',
      body: 'Artificial Intelligence is transforming healthcare through predictive diagnostics, personalized treatment plans, and automated administrative workflows. Hospitals are increasingly adopting AI-powered tools to improve efficiency and patient outcomes.',
      excerpt: 'AI is reshaping healthcare through smarter diagnostics and automation.',
      imageUrl: 'https://example.com/images/ai-healthcare.jpg',
      status: 'published',
      analysisData: {
        wordCount: 32,
        readingTimeMinutes: 1,
        sentiment: 'positive',
        keywords: ['AI', 'healthcare', 'technology', 'diagnostics'],
        generatedAt: '2026-02-23T10:15:00Z',
      },
      summarisedStory:
        'AI technologies are improving healthcare efficiency and patient outcomes through automation and data-driven insights.',
    }
  }

  public async fetchArticles(params?: object): Promise<void> {
    this.setLoading(true)
    this.clearError()

    try {
      const response = await baseService.get<Article[]>('/articles', params)
      this._articles.value = response.data
    } catch (err) {
      this._error.value = err as Error
    } finally {
      this.setLoading(false)
    }
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    try {
      const response = await baseService.get<Article>(`/articles/${slug}`)
      return response.data;
    } catch (err) {
      this._error.value = err as Error
    } finally {
      this.setLoading(false)
    }
  }

  async createArticle(articleData: CreateArticleDto): Promise<Article> {
    this.setLoading(true)
    this.clearError()

    try {
      const response = await baseService.post<Article>('/articles', articleData)

      console.log(response.data)
      this._articles.value.push(response.data)
      return response.data;
    } catch (err) {
      this._error.value = err as Error
      throw err // optionally rethrow so caller can handle
    } finally {
      this.setLoading(false)
    }
  }

  async getVideos(): Promise<Video[]> {
    // If this is temporary mock data, keep it; otherwise fetch from API
    return [
      {
        id: 1,
        title: 'Virtual Worlds: Design & Impact',
        duration: '10:24',
        image: 'https://images.unsplash.com/photo-1626379953822-baec19c3accd?w=800',
      },
      {
        id: 2,
        title: 'Inside Green Energy',
        duration: '08:45',
        image: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800',
      },
    ]
  }
}
