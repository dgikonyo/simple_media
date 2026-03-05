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
  summarisedStory?: string;             // truly optional

  @Column({ type: 'jsonb', name: 'differences_data', default: {} })
  differencesData!: Record<string, any>; // always has default

  @Exclude()                            // never serialized — breaks circular ref
  @OneToOne(() => Article, (article) => article.analysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}
