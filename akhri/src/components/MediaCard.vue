<template>
  <div class="media-card" @click="$emit('click')">
    <div class="media-card__image-wrap">
      <img :src="image" :alt="title" />
    </div>
    <div>
      <div class="media-card__meta">
        <span class="media-card__category">{{ category }}</span>
        <span>&bull;</span>
        <span>{{ date }}</span>
      </div>
      <h3 class="media-card__title">{{ title }}</h3>
      <span class="media-card__read">Read Now</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MediaCard',
  emits: ['click'],
  props: {
    image: String,
    category: String,
    date: String,
    title: String,
  },
};
</script>