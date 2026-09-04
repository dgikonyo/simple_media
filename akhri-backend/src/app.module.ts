import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticlesModule } from './features/articles/articles.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './features/users/users.module';
import { AuthModule } from './features/auth/auth.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ArticlesAnalysisService } from './features/articles-analysis/articles-analysis.service';
import { PromptsModule } from './features/prompts/prompts.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ArticlesModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    SupabaseModule,
    PromptsModule,
    HttpModule
  ],
  controllers: [AppController],
  providers: [AppService, ArticlesAnalysisService],
})
export class AppModule { }
