import { Module } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  UnlabelledFeedback,
  UnlabelledFeedbackSchema,
} from './feedback.schema';
import { HttpModule } from '@nestjs/axios';
import { ArticlesModule } from '../articles/articles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UnlabelledFeedback.name, schema: UnlabelledFeedbackSchema },
    ]),
    ArticlesModule,
    HttpModule,
  ],
  providers: [FeedbackService],
  controllers: [FeedbackController],
})
export class FeedbackModule {}
