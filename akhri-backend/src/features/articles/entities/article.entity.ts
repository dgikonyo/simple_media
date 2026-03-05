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
  id!: number;                    // always set by DB after save

  @Column()
  title!: string;                 // required

  @Column({ unique: true })
  slug!: string;                  // required, auto-generated

  @Column('text')
  body!: string;                  // required

  @Column({ nullable: true })
  excerpt?: string;               // truly optional

  @Column({ name: 'image_url', nullable: true })
  imageUrl?: string;              // truly optional

  @Column({ default: 'draft' })
  status!: string;                // always has default

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'blogger_id' })
  blogger!: UserEntity;           // always required

  @OneToOne(() => ArticleAnalysis, (analysis) => analysis.article, {
    cascade: true,
  })
  analysis?: ArticleAnalysis;     // truly optional — not every article has analysis

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;               // always set by DB

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;               // always set by DB

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
