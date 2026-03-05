<template>
  <div class="mb-8 border-t border-gray-800 pt-6">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <span
          v-if="subtitle"
          class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1 block"
        >
          {{ subtitle }}
        </span>
        <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
          {{ title }}
        </h2>
      </div>
      <button
        v-if="actionText"
        class="group flex items-center text-sm text-brand-gray hover:text-brand-gold transition-colors"
      >
        {{ actionText }}
        <svg
          class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  subtitle: String,
  title: String,
  actionText: String,
})
</script>
