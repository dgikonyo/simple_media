<template>
  <div class="article-row" @click="$emit('click')">
    <div class="article-row__author">
      <img v-if="authorImage" :src="authorImage" class="article-row__author-img" :alt="authorName" />
      <div>
        <p class="article-row__author-name">{{ authorName }}</p>
        <p class="article-row__author-role">{{ role }}</p>
      </div>
    </div>

    <div style="flex: 1;">
      <div class="article-row__date">{{ date }}</div>
      <h3 class="article-row__title">{{ title }}</h3>
      <p class="article-row__excerpt">{{ excerpt }}</p>
      <div class="article-row__tags">
        <span v-for="tag in tags" :key="tag" class="article-row__tag">#{{ tag }}</span>
      </div>
    </div>

    <div class="article-row__action">
      <button class="btn btn--icon">
        <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleRow',
  emits: ['click'],
  props: {
    authorImage: String,
    authorName: String,
    role: String,
    date: String,
    title: String,
    excerpt: String,
    tags: Array,
  },
};
</script>