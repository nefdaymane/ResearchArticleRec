import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument } from '../articles/article.schema';
import {
  UnlabelledFeedback,
  UnlabelledFeedbackDocument,
} from './feedback.schema';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FeedbackService {
  private readonly flaskUrl = 'http://127.0.0.1:5000/predict-popularity';

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(UnlabelledFeedback.name)
    private feedbackModel: Model<UnlabelledFeedbackDocument>,
  ) {}

  async calculateFeedback(articleId: string): Promise<any> {
    // Fetch the article using `article_id` from MongoDB
    const article = await this.articleModel
      .findOne({ article_id: articleId })
      .exec();
    if (!article) {
      throw new Error(`Article with article_id ${articleId} not found`);
    }

    // Send a request to Flask for popularity prediction
    const flaskResponse = await this.httpService
      .post(this.flaskUrl, {
        article_id: articleId,
        citeulike_id: article.citeulike_id,
        raw_title: article.raw_title,
        raw_abstract: article.raw_abstract,
      })
      .toPromise();

    const predictedPopularity = flaskResponse.data.predicted_popularity;

    // Save feedback with the predicted popularity
    await this.feedbackModel.create({
      user_id: Math.floor(Math.random() * 1000), // Mock user_id
      item_id: articleId,
      uncertainty: 0, // Mocked for now; fetch from Flask if needed
      popularity: predictedPopularity,
      hybrid_score: 0, // To be calculated separately
      status: 'PENDING',
    });

    return {
      articleId,
      predictedPopularity,
    };
  }
}
