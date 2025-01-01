import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Article, ArticleSchema } from './article.schema';
import { ArticlesService } from './article.service';
import { ArticlesController } from './article.controller';
import { FlaskModule } from '../flask/flask.module';
import { HttpModule } from '@nestjs/axios';
import { InteractionsModule } from '../interactions/interactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Article.name, schema: ArticleSchema }]),
    FlaskModule,
    InteractionsModule,
    HttpModule,
  ],
  providers: [ArticlesService],
  controllers: [ArticlesController],
  exports: [MongooseModule],
})
export class ArticlesModule {}
