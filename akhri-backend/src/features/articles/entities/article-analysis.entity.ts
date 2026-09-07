import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Article } from './article.entity';
import { Exclude } from 'class-transformer';

@Entity('article_analysis')
export class ArticleAnalysis {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'summarised_story', type: 'text', nullable: true })
  summarisedStory?: string;

  @Column({ type: 'jsonb', name: 'differences_data', default: {} })
  differencesData!: Record<string, any>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @Exclude()
  @OneToOne(() => Article, (article) => article.analysis, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'article_id' })
  article!: Article;
}
