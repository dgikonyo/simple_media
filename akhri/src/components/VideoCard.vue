<template>
  <div class="group relative cursor-pointer rounded-xl overflow-hidden aspect-video">
    <img
      :src="image"
      class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
    />
    <div
      class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"
    ></div>

    <div class="absolute bottom-4 left-4 z-10">
      <div class="flex items-center gap-3">
        <div
          class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black transition-colors text-white"
        >
          <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        </div>
        <div>
          <h4 class="text-white font-bold text-sm leading-tight">{{ title }}</h4>
          <p class="text-xs text-gray-300 mt-1">{{ duration }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['image', 'title', 'duration'])
</script>
