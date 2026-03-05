<template>
  <section
    class="bg-gradient-to-r from-gray-900 to-black rounded-3xl p-8 md:p-12 relative overflow-hidden border border-gray-800"
  >
    <div
      class="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8"
    >
      <div class="max-w-xl">
        <div class="w-12 h-12 bg-yellow-500 rounded-lg mb-6 flex items-center justify-center">
          <svg class="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
            />
          </svg>
        </div>
        <h2 class="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
          Be Part of the Future Tech Revolution
        </h2>
        <p class="text-gray-400">
          Join our community to get the latest graphical stories, intensive analysis, and tech
          updates directly to your inbox.
        </p>
      </div>

      <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
        <div class="bg-gray-800/50 p-4 rounded-xl flex items-center gap-4 border border-gray-700">
          <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span class="text-white font-medium">Resource Access</span>
          <button
            class="ml-auto w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black"
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
        <div class="bg-gray-800/50 p-4 rounded-xl flex items-center gap-4 border border-gray-700">
          <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
          <span class="text-white font-medium">Community Forum</span>
          <button
            class="ml-auto w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-black"
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
    </div>
  </section>
</template>
