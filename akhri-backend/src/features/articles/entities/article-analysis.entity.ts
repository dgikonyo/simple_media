import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Exclude } from 'class-transformer';

@Entity('article_analysis')
export class ArticleAnalysis {
  @PrimaryGeneratedColumn()
  id!: number;                          // always set by DB after save

  @Column({ name: 'summarised_story', nullable: true })
  summarisedStory?: string;

  @Column({ name: "excerpt", nullable: true })
  excerpt?: string;

  @Column({ name: 'sentiment', nullable: true })
  sentiment?: string;

  @Column({ type: 'simple-array', name: 'keywords', nullable: true })
  keywords?: string[];

  @Column({ name: "word_count", nullable: false })
  word_count!: number;

  @Column({ name: "reading_time_minutes", nullable: false })
  reading_time_minutes!: number;

  @Column({ type: 'timestamp', name: "analysis_generated_at", nullable: false })
  analysis_generated_at!: Date;

  @Column({ type: 'jsonb', name: 'differences_data', default: {} })
  differencesData!: Record<string, any>;

  @Exclude()                            // never serialized — breaks circular ref
  @OneToOne(() => Article, (article) => article.analysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}
