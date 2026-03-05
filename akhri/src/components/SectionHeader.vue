<!-- ============================================================
     SectionHeader.vue
     ============================================================ -->
<template>
  <div class="section-header">
    <div>
      <span v-if="subtitle" class="section-header__subtitle">{{ subtitle }}</span>
      <h2 class="section-header__title">{{ title }}</h2>
    </div>
    <button v-if="actionText" class="section-header__action">
      {{ actionText }}
      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
      </svg>
    </button>
  </div>
</template>

<script>
export default {
  name: 'SectionHeader',
  props: {
    subtitle: String,
    title: String,
    actionText: String,
  },
};
</script>