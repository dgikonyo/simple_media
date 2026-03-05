<template>
  <footer class="border-t border-gray-800 bg-black pt-16 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
        <div>
          <h4 class="text-white font-bold mb-6">Info</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            <li><a href="#" class="hover:text-brand-gold transition-colors">About Us</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Careers</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Press</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">News</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            <li><a href="#" class="hover:text-brand-gold transition-colors">Tech</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Science</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Culture</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Health</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Legal</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            <li><a href="#" class="hover:text-brand-gold transition-colors">Privacy Policy</a></li>
            <li>
              <a href="#" class="hover:text-brand-gold transition-colors">Terms of Service</a>
            </li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Cookie Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Social</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            <li><a href="#" class="hover:text-brand-gold transition-colors">Twitter / X</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Instagram</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">LinkedIn</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">YouTube</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Services</h4>
          <ul class="space-y-4 text-sm text-gray-400">
            <li><a href="#" class="hover:text-brand-gold transition-colors">Advertise</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Subscription</a></li>
            <li><a href="#" class="hover:text-brand-gold transition-colors">Talent Hunt</a></li>
          </ul>
        </div>
      </div>

      <div
        class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <div class="text-xs text-gray-500">&copy; 2025 FutureTech Media. All rights reserved.</div>

        <div class="flex gap-6 text-xs text-gray-500">
          <a href="#" class="hover:text-brand-gold transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-brand-gold transition-colors">Terms & Conditions</a>
        </div>

        <div class="flex gap-4">
          <a
            href="#"
            class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-black transition-all"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"
              />
            </svg>
          </a>
          <a
            href="#"
            class="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:bg-brand-gold hover:text-black transition-all"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No props needed for a static footer
</script>
