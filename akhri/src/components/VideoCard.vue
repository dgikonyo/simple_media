<template>
  <div class="video-card">
    <img :src="image" :alt="title" class="video-card__img" />
    <div class="video-card__overlay"></div>
    <div class="video-card__body">
      <button class="video-card__play">
        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
      <div>
        <h4 class="video-card__title">{{ title }}</h4>
        <p class="video-card__duration">{{ duration }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoCard',
  props: {
    image: String,
    title: String,
    duration: String,
  },
};
</script>