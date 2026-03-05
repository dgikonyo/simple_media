<template>
  <div class="bg-gray-900/50 rounded-xl p-6 mb-6 border border-gray-800">
    <h3 v-if="title" class="text-white font-bold mb-4 text-lg">{{ title }}</h3>
    <slot></slot>
  </div>
</template>
<script setup>
defineProps(['title'])
</script>
