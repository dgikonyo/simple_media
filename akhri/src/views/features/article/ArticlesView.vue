<template>
    <div class="page-wrap">

        <!-- Loading -->
        <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height:60vh;">
            <div class="spinner-ring"></div>
        </div>

        <!-- Error / Not found -->
        <div v-else-if="error" class="empty-state">
            <div class="empty-state__icon">⚠</div>
            <h3>Article not found</h3>
            <p>{{ error }}</p>
            <router-link to="/">
                <button class="btn-outline-theme btn mt-3">← Back to articles</button>
            </router-link>
        </div>

        <!-- Article -->
        <div v-else-if="article">

            <!-- Hero image -->
            <div v-if="article.imageUrl" class="article-view__hero">
                <img :src="article.imageUrl" :alt="article.title" />
                <div class="article-view__hero-overlay"></div>
            </div>

            <!-- Content -->
            <div class="container">
                <div class="article-view__layout">

                    <!-- Main body -->
                    <main class="article-view__main">

                        <div class="article-view__meta">
                            <router-link to="/" class="article-view__back">← Articles</router-link>
                            <span class="article-card__meta-dot">·</span>
                            <span>{{ formatDate(article.createdAt) }}</span>
                            <span class="article-card__meta-dot">·</span>
                            <span class="status-badge"
                                :class="article.status === 'published' ? 'status-badge--published' : ''">
                                {{ article.status }}
                            </span>
                        </div>

                        <h1 class="article-view__title">{{ article.title }}</h1>

                        <p v-if="article.excerpt" class="article-view__excerpt">{{ article.excerpt }}</p>

                        <div v-if="article.blogger" class="article-view__author">
                            <div class="article-card__author-avatar" style="width:32px;height:32px;font-size:0.75rem;">
                                {{ authorInitials(article.blogger) }}
                            </div>
                            <div>
                                <div
                                    style="font-size:0.875rem;font-weight:600;color:var(--text);font-family:sans-serif;">
                                    {{ article.blogger.firstName }} {{ article.blogger.lastName }}
                                </div>
                                <div style="font-size:0.75rem;color:var(--text-muted);font-family:sans-serif;">
                                    {{ article.blogger.email }}
                                </div>
                            </div>
                        </div>

                        <hr class="article-view__divider" />

                        <div class="article-view__body" v-html="article.body"></div>

                        <div v-if="article.analysis?.summarisedStory" class="article-view__analysis">
                            <div class="article-view__analysis-label">AI Summary</div>
                            <p class="article-view__analysis-text">{{ article.analysis.summarisedStory }}</p>
                        </div>

                    </main>

                    <!-- Sidebar -->
                    <aside class="article-view__sidebar">
                        <div class="article-view__sidebar-card">
                            <div class="article-view__sidebar-label">Published</div>
                            <div class="article-view__sidebar-value">{{ formatDate(article.createdAt) }}</div>
                        </div>

                        <div v-if="article.blogger" class="article-view__sidebar-card">
                            <div class="article-view__sidebar-label">Author</div>
                            <div class="article-view__sidebar-value">
                                {{ article.blogger.firstName }} {{ article.blogger.lastName }}
                            </div>
                        </div>

                        <div v-if="article.analysis" class="article-view__sidebar-card">
                            <div class="article-view__sidebar-label">AI Analysis</div>
                            <div style="font-size:0.8rem;line-height:1.5;color:var(--text-muted);">
                                {{ article.analysis.summarisedStory ?? 'Available' }}
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </div>

    </div>
</template>

<script>
import apiClient from '@/api/services/client.service';

export default {
    name: 'ArticleView',

    props: ['slug'],

    data() {
        return {
            article: null,
            loading: false,
            error: null,
        };
    },

    async mounted() {
        await this.fetchArticle();
    },

    watch: {
        slug() { this.fetchArticle(); },
    },

    methods: {
        async fetchArticle() {
            this.loading = true;
            this.error = null;
            this.article = null;
            try {
                const { data } = await apiClient.get(`/articles/${this.slug}`);
                this.article = data;
            } catch (err) {
                this.error = err?.response?.status === 404
                    ? 'This article does not exist.'
                    : 'Failed to load article. Please try again.';
            } finally {
                this.loading = false;
            }
        },

        formatDate(dateStr) {
            if (!dateStr) return '';
            return new Date(dateStr).toLocaleDateString('en-US', {
                month: 'long', day: 'numeric', year: 'numeric',
            });
        },

        authorInitials(blogger) {
            if (!blogger) return '?';
            return `${blogger.firstName?.[0] ?? ''}${blogger.lastName?.[0] ?? ''}`.toUpperCase() || '?';
        },
    },
};
</script>