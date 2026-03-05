<template>
  <div class="bg-black min-h-screen text-gray-300" v-if="article">
    <section class="relative h-[60vh] min-h-[500px]">
      <img :src="article.image_url" class="absolute inset-0 w-full h-full object-cover" />
      <div class="absolute inset-0 bg-gradient-to-t from-black" />
      <div class="container mx-auto px-4 h-full flex items-end pb-16 relative z-10">
        <h1 class="text-4xl md:text-6xl font-bold text-white max-w-4xl">{{ article.title }}</h1>
      </div>
    </section>

    <main class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div class="lg:col-span-8 prose prose-lg prose-invert max-w-none prose-yellow" v-html="article.body"></div>

        <div class="lg:col-span-4 space-y-8">
          <SidebarBlock>
            <div class="flex justify-around text-center divide-x divide-gray-800">
              <div class="px-4">
                <div class="text-2xl font-bold text-white">{{ article.view_count || 0 }}</div>
                <div class="text-xs text-gray-500 uppercase">Views</div>
              </div>
              <div class="px-4">
                <div class="text-2xl font-bold text-white">2026</div>
                <div class="text-xs text-gray-500 uppercase">Year</div>
              </div>
            </div>
          </SidebarBlock>

          <SidebarBlock v-if="article.summarised_story">
            <h4 class="text-yellow-500 font-bold text-xs uppercase mb-4">AI Analysis</h4>
            <p class="text-sm italic text-gray-400">"{{ article.summarised_story }}"</p>
          </SidebarBlock>
        </div>
      </div>
    </main>
    <CTASection />
  </div>
</template>

<script>
import api from '@/api/client.service';
import SidebarBlock from '@/components/SideBarBlock.vue';
import CTASection from '@/components/CTASection.vue';
import { ArticlesService } from '@/api/services/features/articles.service';

const articleService = new ArticlesService();

export default {
  components: { SidebarBlock, CTASection },
  props: ['slug'],
  data() { return { article: null } },
  methods: {
    async load() {
       this.article = await articleService.getArticleBySlug(this.slug) 
      }
  },
  mounted() { this.load() },
  watch: { slug() { this.load() } }
}
</script>