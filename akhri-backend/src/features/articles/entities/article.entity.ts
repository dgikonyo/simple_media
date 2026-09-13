import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity'; // Assumed location
import { ArticleAnalysis } from './article-analysis.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  title!: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  slug!: string;

  @Column({ type: 'text' })
  body!: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  excerpt?: string;

  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl?: string;

  @Column({ type: 'varchar', length: 20, default: 'draft' })
  status!: string;

  // --- Denormalized Counters ---
  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount!: number;

  @Column({ name: 'like_count', type: 'int', default: 0 })
  likeCount!: number;

  @Column({ name: 'comment_count', type: 'int', default: 0 })
  commentCount!: number;

  @Column({ name: 'search_vector', type: 'tsvector', nullable: true })
  searchVector?: any;

  // --- AI Analysis Fields (Moved from ArticleAnalysis) ---
  @Column({ name: 'summarised_story', type: 'text', nullable: true })
  summarisedStory?: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  sentiment?: string;

  @Column('text', { array: true, nullable: true })
  keywords?: string[];

  @Column({ name: 'word_count', type: 'int', nullable: true })
  wordCount?: number;

  @Column({ name: 'reading_time_minutes', type: 'int', nullable: true })
  readingTimeMinutes?: number;

  @Column({ name: 'analysis_generated_at', type: 'timestamptz', nullable: true })
  analysisGeneratedAt?: Date;

  // --- Relations & Timestamps ---
  @ManyToOne(() => UserEntity, { eager: true })
  @JoinColumn({ name: 'blogger_id' })
  blogger!: UserEntity;

  @OneToOne(() => ArticleAnalysis, (analysis) => analysis.article, {
    cascade: true,
    eager: true,
  })
  analysis?: ArticleAnalysis;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;

  @BeforeInsert()
  generateSlug() {
    if (this.title) {
      this.slug = this.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      this.slug = `${this.slug}-${Math.random().toString(36).substring(2, 7)}`;
    }
  }
}
