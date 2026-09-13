<template>
    <div class="editor-wrap">

        <!-- Editor top bar -->
        <div class="editor-bar">
            <span class="editor-bar__title">New Article</span>
            <div class="editor-bar__actions">
                <span v-if="saveStatus" class="text-muted" style="font-size:0.75rem;font-family:sans-serif;">
                    {{ saveStatus }}
                </span>
                <button class="btn-outline-theme btn btn-sm" @click="publish('draft')" :disabled="saving">
                    Save draft
                </button>
                <button class="btn-dark-theme btn btn-sm" @click="publish('published')" :disabled="saving">
                    {{ saving ? 'Publishing…' : 'Publish' }}
                </button>
            </div>
        </div>

        <div class="editor-body">

            <!-- Main writing area -->
            <div class="editor-main">
                <div class="editor-inner">

                    <textarea class="editor-field-title" rows="2" v-model="form.title" placeholder="Title"
                        @input="autoResize"></textarea>

                    <textarea class="editor-field-excerpt" rows="2" v-model="form.excerpt"
                        placeholder="Short description (optional)" @input="autoResize"></textarea>

                    <div v-if="editor">
                        <bubble-menu :editor="editor" v-if="editor.isActive">
                            <div class="d-flex bg-dark rounded overflow-hidden shadow">
                                <button class="btn btn-sm btn-dark px-2 py-1"
                                    @click="editor.chain().focus().toggleBold().run()"
                                    :class="{ active: editor.isActive('bold') }"><b>B</b></button>
                                <button class="btn btn-sm btn-dark px-2 py-1"
                                    @click="editor.chain().focus().toggleItalic().run()"
                                    :class="{ active: editor.isActive('italic') }"><i>I</i></button>
                                <button class="btn btn-sm btn-dark px-2 py-1"
                                    @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">H2</button>
                                <button class="btn btn-sm btn-dark px-2 py-1"
                                    @click="editor.chain().focus().toggleBlockquote().run()">"</button>
                            </div>
                        </bubble-menu>
                        <editor-content :editor="editor" class="editor-prose" />
                    </div>

                </div>
            </div>

            <!-- Sidebar -->
            <aside class="editor-sidebar">

                <div>
                    <span class="editor-sidebar__label">Cover Image URL</span>
                    <input type="url" class="form-control form-control-sm" v-model="form.imageUrl"
                        placeholder="https://..." @change="previewImage = form.imageUrl" />
                    <div class="editor-sidebar__preview mt-2">
                        <img v-if="previewImage" :src="previewImage" alt="cover" />
                        <span v-else>No image</span>
                    </div>
                </div>

                <div>
                    <span class="editor-sidebar__label">Slug</span>
                    <input type="text" class="form-control form-control-sm" v-model="form.slug"
                        placeholder="auto-generated" />
                    <div class="form-text" style="font-size:0.7rem;color:var(--text-muted)">Leave blank to auto-generate
                        from title</div>
                </div>

                <div v-if="error">
                    <p class="form-error mb-0">{{ error }}</p>
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
import { useAuthStore } from '@/stores/auth';
import apiClient from '@/api/services/client.service';

export default {
    name: 'CreateArticleView',
    components: { EditorContent, BubbleMenu },

    setup() {
        const editor = useEditor({
            extensions: [
                StarterKit,
                Placeholder.configure({ placeholder: 'Tell your story…' }),
            ],
            editorProps: { attributes: { class: 'editor-prose' } },
            content: '',
        });
        return { editor };
    },

    data() {
        return {
            form: {
                title: '',
                excerpt: '',
                imageUrl: '',
                slug: '',
            },
            previewImage: '',
            saving: false,
            saveStatus: '',
            error: null,
        };
    },

    beforeUnmount() {
        this.editor?.destroy();
    },

    methods: {
        autoResize(e) {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        },

        slugify(text) {
            return text.toLowerCase().trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/\s+/g, '-');
        },

        async publish(status) {
            if (!this.form.title.trim()) { this.error = 'Title is required.'; return; }
            if (!this.editor?.getText().trim()) { this.error = 'Article body cannot be empty.'; return; }

            this.saving = true;
            this.error = null;
            this.saveStatus = '';

            try {
                const payload = {
                    title: this.form.title.trim(),
                    slug: this.form.slug.trim() || this.slugify(this.form.title),
                    imageUrl: this.form.imageUrl.trim() || null,
                    body: this.editor.getText({ blockSeparator: '\n\n' }),
                    status,
                };

                await apiClient.post('/articles', payload);
                this.saveStatus = status === 'published' ? 'Published ✓' : 'Draft saved ✓';
                setTimeout(() => this.$router.push('/'), 800);
            } catch (err) {
                this.error = err?.response?.data?.message ?? 'Failed to save. Please try again.';
            } finally {
                this.saving = false;
            }
        },
    },
};
</script>