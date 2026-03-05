<template>
  <section class="cta">
    <div class="cta__inner">
      <div>
        <div class="cta__icon">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <h2 class="cta__title">Be Part of the Future Tech Revolution</h2>
        <p class="cta__description">
          Join our community to get the latest graphical stories, intensive analysis,
          and tech updates directly to your inbox.
        </p>
      </div>

      <div class="cta__actions">
        <div class="cta__action-item">
          <span class="cta__action-dot"></span>
          <span class="cta__action-label">Resource Access</span>
          <button class="btn--gold-circle">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
        <div class="cta__action-item">
          <span class="cta__action-dot"></span>
          <span class="cta__action-label">Community Forum</span>
          <button class="btn--gold-circle">
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'CTASection',
};
</script>