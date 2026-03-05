<template>
    <div class="editor-page">
        <header class="editor-header">
            <div class="editor-header__brand">
                <span class="editor-header__name">NewsPortal</span>
                <span class="editor-header__divider">|</span>
                <span class="editor-header__context">Drafting in Articles</span>
            </div>
            <div class="editor-header__actions">
                <button class="btn btn--ghost" @click="saveArticle('draft')" :disabled="isSubmitting">
                    Save Draft
                </button>
                <button class="btn btn--publish" @click="saveArticle('published')" :disabled="isSubmitting">
                    {{ isSubmitting ? 'Publishing...' : 'Publish' }}
                </button>
            </div>
        </header>

        <div class="editor-main">
            <div class="editor-content">
                <div class="editor-content__inner">
                    <input v-model="title" type="text" placeholder="Title" class="editor-title" />
                    <textarea v-model="excerpt" placeholder="Write a short subtitle..." rows="2"
                        class="editor-excerpt"></textarea>

                    <div class="editor-body">
                        <bubble-menu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }"
                            class="bubble-menu">
                            <button @click="editor.chain().focus().toggleBold().run()">B</button>
                            <button @click="editor.chain().focus().toggleItalic().run()">I</button>
                            <button @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
                            <button @click="editor.chain().focus().toggleBlockquote().run()">"</button>
                        </bubble-menu>
                        <editor-content :editor="editor" />
                    </div>
                </div>
            </div>

            <aside class="editor-sidebar">
                <div class="editor-sidebar__section">
                    <h3 class="editor-sidebar__section-title">Article Settings</h3>
                    <label class="editor-sidebar__label">Cover Image URL</label>
                    <input v-model="imageUrl" type="text" placeholder="https://..." class="editor-sidebar__input" />
                    <div v-if="imageUrl" class="editor-sidebar__preview">
                        <img :src="imageUrl" alt="Cover preview" />
                    </div>
                </div>

                <hr class="editor-sidebar__divider" />

                <div class="editor-sidebar__section">
                    <div class="editor-ai-header">
                        <h3 class="editor-sidebar__section-title">AI Insights</h3>
                        <button class="editor-ai-btn" @click="runAIAnalysis" :disabled="isAnalyzing">
                            {{ isAnalyzing ? 'Analyzing...' : 'Run Analysis ✨' }}
                        </button>
                    </div>

                    <div v-if="summarisedStory">
                        <div class="editor-ai-summary">
                            <p class="editor-ai-summary__label">AI Summary</p>
                            <p class="editor-ai-summary__text">"{{ summarisedStory }}"</p>
                        </div>
                        <div v-if="analysisData" class="editor-ai-grid">
                            <div v-for="(val, key) in analysisData" :key="key" class="editor-ai-stat">
                                <p class="editor-ai-stat__key">{{ String(key).replace('_', ' ') }}</p>
                                <p class="editor-ai-stat__val">{{ val }}</p>
                            </div>
                        </div>
                    </div>
                    <p v-else class="editor-ai-empty">
                        Click Run Analysis to generate summaries and metadata.
                    </p>
                </div>
            </aside>
        </div>
    </div>
</template>

<script>
import { useEditor, EditorContent } from '@tiptap/vue-3';
import { BubbleMenu } from '@tiptap/extension-bubble-menu';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { ArticlesService } from '@/api/services/features/articles.service';
import { useAuthStore } from '@/stores/auth';

const articleService = new ArticlesService();

export default {
    name: 'CreateArticleView',
    components: { EditorContent, BubbleMenu },

    // useEditor is a composable — MUST run in setup(), not mounted()
    // setup() return values are merged into the component instance,
    // so this.editor works normally everywhere else in Options API.
    setup() {
        const editor = useEditor({
            extensions: [
                StarterKit,
                Placeholder.configure({ placeholder: 'Tell your story...' }),
            ],
            editorProps: {
                attributes: { class: 'editor-prose' },
            },
            content: '',
        });
        return { editor };
    },

    data() {
        return {
            title: '',
            excerpt: '',
            imageUrl: '',
            isAnalyzing: false,
            isSubmitting: false,
            summarisedStory: '',
            analysisData: null,
        };
    },

    beforeUnmount() {
        this.editor?.destroy();
    },

    methods: {
        async runAIAnalysis() {
            if (!this.editor?.getText().trim()) {
                alert('Please write something first!');
                return;
            }
            this.isAnalyzing = true;
            try {
                await new Promise((resolve) => setTimeout(resolve, 2000));
                this.summarisedStory = 'This article explores the intersection of high-end journalism and AI automation in 2026.';
                this.analysisData = {
                    sentiment: 'Professional',
                    reading_level: 'Advanced',
                    key_entities: 'Technology, Journalism',
                    fact_check_flags: 0,
                };
            } finally {
                this.isAnalyzing = false;
            }
        },

        async saveArticle(status) {
            if (!this.title) { alert('Title is required'); return; }

            const authStore = useAuthStore();
            if (!authStore.user) {
                alert('Your session is missing. Please log in again.');
                return;
            }

            this.isSubmitting = true;
            try {
                const payload = {
                    title: this.title,
                    body: this.editor?.getHTML() || '',
                    excerpt: this.excerpt,
                    imageUrl: this.imageUrl,
                    status,
                    summarisedStory: this.summarisedStory,
                    analysisData: this.analysisData || {},
                };
                const response = await articleService.createArticle(payload);
                this.$router.push(`/article/${response.slug}`);
            } catch (error) {
                console.error('Save failed:', error);
                alert('Failed to save article. Check console.');
            } finally {
                this.isSubmitting = false;
            }
        },
    },
};
</script>