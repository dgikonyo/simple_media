<template>
  <div
    class="group flex flex-col md:flex-row items-start gap-6 py-6 border-b border-gray-800 last:border-0 hover:bg-white/5 p-4 rounded-xl transition-colors cursor-pointer"
  >
    <div class="flex items-center md:w-48 shrink-0 gap-3">
      <img :src="authorImage" class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-800" />
      <div>
        <p class="text-sm font-bold text-white">{{ authorName }}</p>
        <p class="text-xs text-brand-gray">{{ role }}</p>
      </div>
    </div>

    <div class="flex-grow">
      <div class="text-xs text-brand-gray mb-1">{{ date }}</div>
      <h3 class="text-xl font-bold text-white mb-2 group-hover:text-brand-gold transition-colors">
        {{ title }}
      </h3>
      <p class="text-brand-gray text-sm line-clamp-2 md:w-3/4">
        {{ excerpt }}
      </p>

      <div class="mt-3 flex items-center gap-3">
        <span
          v-for="tag in tags"
          :key="tag"
          class="text-xs bg-gray-900 text-gray-400 px-2 py-1 rounded"
          >#{{ tag }}</span
        >
      </div>
    </div>

    <div class="md:self-center shrink-0">
      <button
        class="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-white group-hover:bg-brand-gold group-hover:border-brand-gold group-hover:text-black transition-all"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M14 5l7 7m0 0l-7 7m7-7H3"
          ></path>
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['authorImage', 'authorName', 'role', 'date', 'title', 'excerpt', 'tags'])
</script>
