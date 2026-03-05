<template>
  
  <div class="group cursor-pointer flex flex-col h-full">
    <div class="relative overflow-hidden rounded-lg mb-4 aspect-video">
      <img
        :src="image"
        :alt="title"
        class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>
    </div>
    <div class="flex flex-col flex-grow">
      <div class="flex items-center space-x-2 mb-2 text-xs text-brand-gray">
        <span class="text-brand-gold font-semibold uppercase">{{ category }}</span>
        <span>&bull;</span>
        <span>{{ date }}</span>
      </div>
      <h3
        class="text-lg font-bold text-white leading-snug group-hover:text-brand-gold transition-colors mb-2"
      >
        {{ title }}
      </h3>
      <div class="mt-auto pt-2">
        <span class="text-xs text-brand-gray border border-gray-800 rounded px-2 py-1"
          >Read Now</span
        >
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['image', 'category', 'date', 'title'])
</script>
