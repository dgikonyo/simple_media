import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('country')
export class Country {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id?: number;

  @Column({ name: 'country_name' })
  countryName?: string;

  @Column({ name: 'country_initial' })
  countryInitial?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt?: Date;
}
