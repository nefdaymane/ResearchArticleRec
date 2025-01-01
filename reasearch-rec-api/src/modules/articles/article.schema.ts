import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ArticleDocument = Article & Document;

@Schema({ timestamps: true })
export class Article {
  @Prop()
  article_id: string;

  @Prop()
  citeulike_id: number;

  @Prop()
  title: string;

  @Prop()
  raw_title: string;

  @Prop()
  raw_abstract: string;

  @Prop({ default: 0 })
  popularityScore: number;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);
