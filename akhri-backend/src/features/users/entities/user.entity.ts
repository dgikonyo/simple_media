import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from 'typeorm';
import { Article } from '../../articles/entities/article.entity';
import { Country } from './country.entity';
import { Role } from './role.entity';

@Entity('user_entities')
export class UserEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  @Index({ unique: true }) // Matches your CREATE INDEX query
  @Column()
  email!: string;

  @Column({ type: 'date' })
  dob?: Date;

  @Column({ name: 'country_id', nullable: true })
  countryId?: number;

  @Column({ name: 'role_id' })
  roleId?: number;

  // Relationship to Country
  @ManyToOne(() => Country)
  @JoinColumn({ name: 'country_id' })
  country?: Country;

  // Relationship to Role
  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role?: Role;

  // Link to Articles (Blogger relationship)
  @OneToMany(() => Article, (article) => article.blogger)
  articles?: Article[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
