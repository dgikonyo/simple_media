<template>
  <div class="page">
    <main class="container page__main">
      <div class="page__sections">

        <!-- HEADLINES -->
        <section v-if="!loading.headlines">
          <SectionHeader title="Today's Headlines" subtitle="Stay Informed" />
          <div class="headlines-grid">
            <div v-if="featured" class="headlines-featured" @click="goToArticle(featured)">
              <img :src="featured.image_url" class="headlines-featured__img" />
              <div class="headlines-featured__overlay"></div>
              <div class="headlines-featured__body">
                <span class="headlines-featured__badge">Featured</span>
                <h2 class="headlines-featured__title">{{ featured.title }}</h2>
              </div>
            </div>

            <div class="headlines-side">
              <MediaCard v-for="item in sideHeadlines" :key="item.id" :image="item.image_url" :category="item.category"
                :title="item.title" :date="formatDate(item.created_at)" @click="goToArticle(item)" />
            </div>
          </div>
        </section>

        <!-- LATEST FEED -->
        <section id="feed">
          <SectionHeader title="Latest Feed" subtitle="Discover News" />
          <div v-if="loading.articles">
            <div v-for="n in 3" :key="n" class="skeleton skeleton--article-row"></div>
          </div>
          <div v-else>
            <ArticleRow v-for="article in articles" :key="article.id" :image="article.image_url"
              :authorName="article.author?.name" :date="formatDate(article.created_at)" :title="article.title"
              :excerpt="article.excerpt" :tags="article.tags" @click="goToArticle(article)" />
          </div>
        </section>

        <!-- VISUAL INSIGHTS -->
        <section>
          <SectionHeader title="Visual Insights" actionText="See Gallery" />
          <div class="headlines-side">
            <VideoCard v-for="video in videos" :key="video.id" v-bind="video" />
          </div>
        </section>

      </div>
    </main>
    <CTASection />
  </div>
</template>

<script>
import api from '@/api/client.service';
import SectionHeader from '@/components/SectionHeader.vue';
import MediaCard from '@/components/MediaCard.vue';
import ArticleRow from '@/components/ArticleRow.vue';
import VideoCard from '@/components/VideoCard.vue';
import CTASection from '@/components/CTASection.vue';

export default {
  name: 'NewsView',
  components: { SectionHeader, MediaCard, ArticleRow, VideoCard, CTASection },

  data() {
    return {
      loading: {
        headlines: true,
        articles: true,
      },
      headlines: [],
      articles: [],
      videos: [],
    };
  },

  computed: {
    featured() {
      return this.headlines[0] || null;
    },
    sideHeadlines() {
      return this.headlines.slice(1, 5);
    },
  },

  async mounted() {
    await this.init();
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
      return new Date(d).toLocaleDateString();
    },

    goToArticle(article) {
      this.$router.push({ name: 'article-detail', params: { slug: article.slug } });
    },
  },
};
</script>