<template>
  <div class="sidebar-block">
    <h3 v-if="title" class="sidebar-block__title">{{ title }}</h3>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'SidebarBlock',
  props: {
    title: String,
  },
};
</script>