<template>
  <div class="page" v-if="article">
    <!-- Hero -->
    <section class="article-hero">
      <img :src="article.image_url" class="article-hero__img" />
      <div class="article-hero__overlay"></div>
      <div class="article-hero__body">
        <div class="container">
          <h1 class="article-hero__title">{{ article.title }}</h1>
        </div>
      </div>
    </section>

    <!-- Body -->
    <main class="article-main">
      <div class="container">
        <div class="article-layout">
          <div class="article-body" v-html="article.body"></div>

          <aside class="article-sidebar">
            <SidebarBlock>
              <div class="article-stats">
                <div>
                  <div class="article-stat__value">{{ article.view_count || 0 }}</div>
                  <div class="article-stat__label">Views</div>
                </div>
                <div>
                  <div class="article-stat__value">2026</div>
                  <div class="article-stat__label">Year</div>
                </div>
              </div>
            </SidebarBlock>

            <SidebarBlock v-if="article.summarised_story">
              <p class="article-ai-label">AI Analysis</p>
              <p class="article-ai-quote">"{{ article.summarised_story }}"</p>
            </SidebarBlock>
          </aside>
        </div>
      </div>
    </main>

    <CTASection />
  </div>
</template>

<script>
import { ArticlesService } from '@/api/services/features/articles.service';
import SidebarBlock from '@/components/SideBarBlock.vue';
import CTASection from '@/components/CTASection.vue';

const articleService = new ArticlesService();

export default {
  name: 'ArticleView',

  components: { SidebarBlock, CTASection },

  props: ['slug'],

  data() {
    return {
      article: null,
    };
  },

  async mounted() {
    await this.load();
  },

  watch: {
    slug() {
      this.load();
    },
  },

  methods: {
    async load() {
      this.article = await articleService.getArticleBySlug(this.slug);
    },
  },
};
</script>