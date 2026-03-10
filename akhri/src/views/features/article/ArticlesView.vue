<template>
  <div class="page-wrap">

    <!-- Header -->
    <div class="articles-header">
      <div class="container">
        <div class="d-flex align-items-end justify-content-between flex-wrap gap-3">
          <div>
            <h1>Articles</h1>
            <p>{{ totalArticles }} {{ totalArticles === 1 ? 'article' : 'articles' }} published</p>
          </div>
          <router-link v-if="isLoggedIn" to="/create">
            <button class="btn-dark-theme btn">+ Write</button>
          </router-link>
        </div>
      </div>
    </div>

    <div class="container pb-5">

      <!-- Loading -->
      <div v-if="loading" class="row g-4">
        <div v-for="n in 6" :key="n" class="col-12 col-sm-6 col-lg-4">
          <div class="article-card p-0">
            <div class="article-card__img-placeholder">
              <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
            </div>
            <div class="article-card__body gap-2">
              <div class="placeholder-glow"><span class="placeholder col-4"
                  style="height:10px;border-radius:4px;background-color:var(--border)"></span></div>
              <div class="placeholder-glow"><span class="placeholder col-9"
                  style="height:14px;border-radius:4px;background-color:var(--border)"></span></div>
              <div class="placeholder-glow"><span class="placeholder col-7"
                  style="height:10px;border-radius:4px;background-color:var(--border)"></span></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="empty-state">
        <div class="empty-state__icon">⚠</div>
        <h3>Failed to load articles</h3>
        <p>{{ error.message }}</p>
        <button class="btn-outline-theme btn mt-3" @click="fetchArticles">Try again</button>
      </div>

      <!-- Empty -->
      <div v-else-if="!articles.length" class="empty-state">
        <div class="empty-state__icon">📄</div>
        <h3>No articles yet</h3>
        <p>Be the first to publish something.</p>
        <router-link v-if="isLoggedIn" to="/create">
          <button class="btn-dark-theme btn mt-3">Write an article</button>
        </router-link>
      </div>

      <!-- Grid -->
      <div v-else class="row g-4">
        <div v-for="article in articles" :key="article.id" class="col-12 col-sm-6 col-lg-4">
          <router-link :to="`/articles/${article.slug}`" class="article-card text-decoration-none">

            <img v-if="article.imageUrl" :src="article.imageUrl" :alt="article.title" class="article-card__img" />
            <div v-else class="article-card__img-placeholder">📝</div>

            <div class="article-card__body">
              <div class="article-card__meta">
                <span>{{ formatDate(article.createdAt) }}</span>
                <span class="article-card__meta-dot">·</span>
                <span class="status-badge" :class="article.status === 'published' ? 'status-badge--published' : ''">
                  {{ article.status }}
                </span>
              </div>
              <div class="article-card__title">{{ article.title }}</div>
              <p v-if="article.excerpt" class="article-card__excerpt">{{ article.excerpt }}</p>

              <div class="article-card__footer">
                <div class="article-card__author-avatar">{{ authorInitials(article.blogger) }}</div>
                <span class="article-card__author-name">
                  {{ article.blogger ? `${article.blogger.firstName} ${article.blogger.lastName}` : 'Unknown' }}
                </span>
              </div>
            </div>

          </router-link>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="articles-pagination d-flex justify-content-center">
        <ul class="pagination">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="goToPage(currentPage - 1)">‹ Prev</button>
          </li>
          <li v-for="page in pageNumbers" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="goToPage(currentPage + 1)">Next ›</button>
          </li>
        </ul>
      </div>

    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/api/services/client.service';

const PER_PAGE = 9;

export default {
  name: 'ArticlesView',

  data() {
    return {
      articles: [],
      totalArticles: 0,
      currentPage: 1,
      loading: false,
      error: null,
    };
  },

  computed: {
    isLoggedIn() { return !!useAuthStore().session; },
    totalPages() { return Math.ceil(this.totalArticles / PER_PAGE); },
    pageNumbers() {
      const range = [];
      const delta = 2;
      const start = Math.max(1, this.currentPage - delta);
      const end = Math.min(this.totalPages, this.currentPage + delta);
      for (let i = start; i <= end; i++) range.push(i);
      return range;
    },
  },

  async mounted() {
    await this.fetchArticles();
  },

  methods: {
    async fetchArticles() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await apiClient.get('/articles', {
          params: { page: this.currentPage, limit: PER_PAGE },
        });
        // Handle both { items, total } and plain array responses
        if (Array.isArray(data)) {
          this.articles = data;
          this.totalArticles = data.length;
        } else {
          this.articles = data.items ?? data.articles ?? data.data ?? [];
          this.totalArticles = data.total ?? this.articles.length;
        }
      } catch (err) {
        this.error = err;
      } finally {
        this.loading = false;
      }
    },

    async goToPage(page) {
      if (page < 1 || page > this.totalPages) return;
      this.currentPage = page;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await this.fetchArticles();
    },

    formatDate(dateStr) {
      if (!dateStr) return '';
      return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },

    authorInitials(blogger) {
      if (!blogger) return '?';
      return `${blogger.firstName?.[0] ?? ''}${blogger.lastName?.[0] ?? ''}`.toUpperCase() || '?';
    },
  },
};
</script>