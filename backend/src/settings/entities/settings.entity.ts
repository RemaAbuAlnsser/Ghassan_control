import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity('settings')
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Ghassan Aljamal Company' })
  siteName: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string | null;

  @Column({ type: 'varchar', nullable: true })
  favicon: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  whatsapp: string | null;

  @Column({ type: 'varchar', nullable: true })
  facebookUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  instagramUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  tiktokUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  metaPixelId: string | null;

  @Column({
    type: 'varchar',
    length: 500,
    default: 'شريكك الأول في تجهيز المشاريع التجارية',
  })
  heroTitle: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  heroDescription: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  heroLoopWords: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}
