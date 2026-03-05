<template>
  <div>
    <h1>Welcome</h1>
    <button @click="signInWithGoogle" :disabled="loading">
      Sign in with Google
    </button>
    <div v-if="user">Logged in as: {{ user.email }}</div>
  </div>

  <div class="bg-black min-h-screen text-gray-300">
    <main class="container mx-auto px-4 py-8 space-y-20">
      <section v-if="!loading.headlines">
        <SectionHeader title="Today's Headlines" subtitle="Stay Informed" />
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div v-if="featured" @click="goToArticle(featured)"
            class="lg:col-span-7 relative group cursor-pointer overflow-hidden rounded-2xl min-h-[400px]">
            <img :src="featured.image_url"
              class="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105" />
            <div class="absolute inset-0 bg-gradient-to-t from-black opacity-90"></div>
            <div class="absolute bottom-0 p-8">
              <span
                class="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded uppercase mb-3 inline-block">Featured</span>
              <h2 class="text-3xl md:text-4xl font-bold text-white leading-tight">{{ featured.title }}</h2>
            </div>
          </div>
          <div class="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MediaCard v-for="item in sideHeadlines" :key="item.id" :image="item.image_url" :category="item.category"
              :title="item.title" :date="formatDate(item.created_at)" @click="goToArticle(item)" />
          </div>
        </div>
      </section>

      <section id="feed">
        <SectionHeader title="Latest Feed" subtitle="Discover News" />
        <div v-if="loading.articles" class="space-y-4">
          <div v-for="n in 3" :key="n" class="h-32 bg-gray-900 rounded-xl animate-pulse"></div>
        </div>
        <div v-else class="flex flex-col gap-2">
          <ArticleRow v-for="article in articles" :key="article.id" :image="article.image_url"
            :authorName="article.author?.name" :date="formatDate(article.created_at)" :title="article.title"
            :excerpt="article.excerpt" :tags="article.tags" @click="goToArticle(article)" />
        </div>
      </section>

      <section>
        <SectionHeader title="Visual Insights" actionText="See Gallery" />
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <VideoCard v-for="video in videos" :key="video.id" v-bind="video" />
        </div>
      </section>
    </main>
    <CTASection />
  </div>
</template>

<script>
import api from '@/api/client.service';
import SectionHeader from '../components/SectionHeader.vue';
import MediaCard from '../components/MediaCard.vue';
import ArticleRow from '../components/ArticleRow.vue';
import VideoCard from '../components/VideoCard.vue';
import CTASection from '../components/CTASection.vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

export default {
  components: { SectionHeader, MediaCard, ArticleRow, VideoCard, CTASection },

  setup() {
    const authStore = useAuthStore();
    const { user, loading } = storeToRefs(authStore);
    const { signInWithGoogle } = authStore;

    return {
      user,
      loading, // renamed to avoid conflict
      signInWithGoogle,
    };
  },

  data() {
    return {
      loading: {
        headlines: true,
        articles: true
      },
      headlines: [],
      articles: [],
      videos: [],
      pagination: { current: 1, total: 1, limit: 5 },
    }
  },

  computed: {
    featured() {
      return this.headlines[0]
    },
    sideHeadlines() {
      return this.headlines.slice(1, 5)
    }
  },

  methods: {
    async init() {
      this.headlines = await api.getHeadlines();
      this.loading.headlines = false;

      const res = await api.getArticles(1, 5);
      this.articles = res.data;
      this.loading.articles = false;

      this.videos = await api.getVideos();
    },

    formatDate(d) {
      return new Date(d).toLocaleDateString()
    },

    goToArticle(a) {
      this.$router.push({ name: 'article-detail', params: { slug: a.slug } })
    }
  },

  mounted() {
    this.init()
  }
}
</script>