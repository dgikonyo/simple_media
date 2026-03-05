<template>
    <div class="min-h-screen bg-white flex flex-col">
        <header class="border-b px-6 py-3 flex justify-between items-center sticky top-0 bg-white z-10">
            <div class="flex items-center gap-4">
                <span class="font-bold text-xl tracking-tight">NewsPortal</span>
                <span class="text-gray-400">|</span>
                <span class="text-sm text-gray-500 font-medium">Drafting in Articles</span>
            </div>
            <div class="flex items-center gap-3">
                <button @click="saveArticle('draft')" :disabled="isSubmitting"
                    class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-50">
                    Save Draft
                </button>
                <button @click="saveArticle('published')" :disabled="isSubmitting"
                    class="px-4 py-2 text-sm font-medium bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50">
                    {{ isSubmitting ? 'Publishing...' : 'Publish' }}
                </button>
            </div>
        </header>

        <main class="flex-1 flex overflow-hidden">
            <div class="flex-1 overflow-y-auto px-6 py-12 flex justify-center">
                <div class="max-w-3xl w-full space-y-6">
                    <!-- Title input -->
                    <input v-model="title" type="text" placeholder="Title"
                        class="w-full text-5xl font-bold border-none focus:ring-0 placeholder-gray-200 outline-none" />

                    <!-- Excerpt textarea -->
                    <textarea v-model="excerpt" placeholder="Write a short subtitle..." rows="2"
                        class="w-full text-xl text-gray-500 border-none focus:ring-0 placeholder-gray-200 outline-none resize-none"></textarea>

                    <!-- Editor container with relative positioning for bubble menu -->
                    <div class="relative">
                        <!-- Bubble menu (only appears when text is selected) -->
                        <bubble-menu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }"
                            class="flex bg-gray-900 text-white rounded-lg shadow-xl overflow-hidden">
                            <button @click="editor.chain().focus().toggleBold().run()"
                                class="p-2 hover:bg-gray-700">B</button>
                            <button @click="editor.chain().focus().toggleItalic().run()"
                                class="p-2 hover:bg-gray-700">I</button>
                            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                                class="p-2 hover:bg-gray-700">H2</button>
                            <button @click="editor.chain().focus().toggleBlockquote().run()"
                                class="p-2 hover:bg-gray-700">"</button>
                        </bubble-menu>

                        <!-- The actual editor -->
                        <editor-content :editor="editor" />
                    </div>
                </div>
            </div>

            <!-- Sidebar (unchanged) -->
            <aside class="w-80 border-l bg-gray-50 p-6 space-y-8 overflow-y-auto hidden lg:block">
                <div>
                    <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Article Settings</h3>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                    <input v-model="imageUrl" type="text" placeholder="https://..."
                        class="w-full p-2 text-sm border rounded bg-white" />
                    <div v-if="imageUrl" class="mt-4 rounded-lg overflow-hidden border bg-gray-200 aspect-video">
                        <img :src="imageUrl" class="w-full h-full object-cover" />
                    </div>
                </div>

                <hr />

                <div>
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xs font-bold text-gray-400 uppercase tracking-widest">AI Insights</h3>
                        <button @click="runAIAnalysis" :disabled="isAnalyzing"
                            class="text-xs font-bold text-purple-600 hover:text-purple-800 disabled:opacity-50">
                            {{ isAnalyzing ? 'Analyzing...' : 'Run Analysis ✨' }}
                        </button>
                    </div>

                    <div v-if="summarisedStory" class="space-y-4">
                        <div class="bg-purple-50 p-3 rounded-lg">
                            <p class="text-xs font-bold text-purple-700 mb-1">AI Summary</p>
                            <p class="text-sm text-purple-900 leading-relaxed italic">"{{ summarisedStory }}"</p>
                        </div>

                        <div v-if="analysisData" class="grid grid-cols-2 gap-2">
                            <div v-for="(val, key) in analysisData" :key="key" class="bg-white p-2 border rounded">
                                <p class="text-[10px] text-gray-400 uppercase">{{ key.replace('_', ' ') }}</p>
                                <p class="text-xs font-bold text-gray-700">{{ val }}</p>
                            </div>
                        </div>
                    </div>
                    <p v-else class="text-sm text-gray-400 italic text-center py-4">
                        Click Run Analysis to generate summaries and metadata.
                    </p>
                </div>
            </aside>
        </main>
    </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ArticlesService } from '@/api/services/features/articles.service';
import type { CreateArticleDto } from '@/api/services/types';
import { useAuthStore } from '@/stores/auth'; // ✅ import auth store

// --- STATE ---
const router = useRouter();
const authStore = useAuthStore(); // reactive auth state
const title = ref('');
const excerpt = ref('');
const imageUrl = ref('');
const isAnalyzing = ref(false);
const isSubmitting = ref(false);
const summarisedStory = ref('');
const analysisData = ref<Record<string, any> | null>(null);
const articleService = new ArticlesService();

// --- TIPTAP EDITOR SETUP (FIXED) ---
const editor = useEditor({
    extensions: [
        StarterKit,
        Placeholder.configure({
            placeholder: 'Tell your story...',
        }),
    ],
    editorProps: {
        attributes: {
            class: 'prose prose-lg focus:outline-none max-w-none min-h-[500px]',
        },
    },
    content: '<p>Start writing your story...</p>', // initial content
});

// --- LOGIC: AI ANALYSIS ---
const runAIAnalysis = async () => {
    // ✅ Safe check: ensure editor exists before accessing methods
    if (!editor.value) {
        console.warn('Editor not ready yet');
        return;
    }

    if (!editor.value.getText().trim()) {
        alert('Please write something first!');
        return;
    }

    isAnalyzing.value = true;

    try {
        // Simulate AI processing
        await new Promise((resolve) => setTimeout(resolve, 2000));
        summarisedStory.value = "This article explores the intersection of high-end journalism and AI automation in 2026.";
        analysisData.value = {
            sentiment: "Professional",
            reading_level: "Advanced",
            key_entities: ["Technology", "Journalism", "Future"],
            fact_check_flags: 0
        };
    } finally {
        isAnalyzing.value = false;
    }
};

// --- LOGIC: SUBMIT ---
const saveArticle = async (status: 'draft' | 'published') => {
    if (!title.value) return alert('Title is required');

    // ✅ Use auth store for session check
    if (!authStore.fetchUser()) {
        alert('Your session is missing. Please log in again.');
        // Optionally redirect to login page
        // router.push('/login');
        return;
    }

    isSubmitting.value = true;

    const payload: CreateArticleDto = {
        title: title.value,
        body: editor.value?.getHTML() || '',
        excerpt: excerpt.value,
        imageUrl: imageUrl.value,
        status: status,
        summarisedStory: summarisedStory.value,
        analysisData: analysisData.value || {},
    };

    try {
        const response = await articleService.createArticle(payload);
        router.push(`/article/${response.slug}`);
    } catch (error) {
        console.error('Save failed:', error);
        alert('Failed to save article. Check console.');
    } finally {
        isSubmitting.value = false;
    }
};

// Cleanup editor on component unmount
onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<style>
/* Tiptap placeholder styling (only needed if Placeholder extension is used) */
.tiptap p.is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: #adb5bd;
    pointer-events: none;
    height: 0;
}
</style>