import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Model } from 'mongoose';
import { CustomHttpException } from 'src/common/filters/custom-http.exception';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { generateSuccessResponse } from 'src/utils/response.utils';
import { FlaskService } from '../flask/flask.service';
import {
  Interaction,
  InteractionDocument,
} from '../interactions/interaction.schema';
import { Article, ArticleDocument } from './article.schema';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
    @InjectModel(Interaction.name)
    private interactionModel: Model<InteractionDocument>,
    private flaskService: FlaskService,
    private httpService: HttpService,
  ) {}

  async uploadDataset(
    filePath: string,
  ): Promise<{ success: number; failed: number }> {
    // const results = [];
    let successCount = 0;
    let failureCount = 0;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', async (data) => {
          try {
            const article = new this.articleModel({
              article_id: data['doc.id'],
              citeulike_id: data['citeulike.id'],
              title: data['title'],
              raw_title: data['raw.title'],
              raw_abstract: data['raw.abstract'],
            });
            await article.save();
            successCount++;
          } catch (error) {
            console.error('Failed to save article:', error);
            failureCount++;
          }
        })
        .on('end', () => {
          resolve({ success: successCount, failed: failureCount });
        })
        .on('error', (error) => {
          console.error('Error processing CSV:', error);
          reject(error);
        });
    });
  }

  async findAllArticles(
    page: number = 1,
    limit: number = 10,
  ): Promise<ApiResponse<Article[]>> {
    const skip = (page - 1) * limit;
    const articles = await this.articleModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();
    return generateSuccessResponse(articles, 'Articles fetched successfully');
  }

  async findPopularArticles(
    page: number = 1,
    limit: number = 10,
    prioritizePopular: boolean = false,
    topN: number = 6,
  ): Promise<ApiResponse<Article[]>> {
    const skip = (page - 1) * limit;

    let popularArticles = [];
    let popularArticleIds = [];
    const articlesToFetch = prioritizePopular ? Math.min(topN, limit) : 0;

    // Step 1: Fetch popular articles
    if (prioritizePopular) {
      const flaskPopularArticles =
        await this.flaskService.getPopularArticles(articlesToFetch);

      popularArticles = await this.articleModel
        .find({
          article_id: {
            $in: flaskPopularArticles.map((item) => item.article_id),
          },
        })
        .exec();

      popularArticleIds = popularArticles.map((article) => article.article_id);
    }

    // Step 2: Fetch all non-popular articles
    const allNonPopularArticles = await this.articleModel
      .find({ article_id: { $nin: popularArticleIds } })
      .exec();

    // Combine popular and non-popular articles
    const allArticles = [...popularArticles, ...allNonPopularArticles];

    // Step 3: Apply skip and limit to the combined list
    const paginatedArticles = allArticles.slice(skip, skip + limit);

    return generateSuccessResponse(
      paginatedArticles,
      'Articles fetched successfully',
    );
  }

  async findArticleById(articleId: string): Promise<ApiResponse<Article>> {
    const article = await this.articleModel.findOne({ article_id: articleId });

    if (!article) {
      throw new CustomHttpException('Article not found', 404);
    }
    return generateSuccessResponse(article, 'Article fetched successfully');
  }

  // async getRecommendationsForUser(
  //   userId: string,
  //   page: number = 1,
  //   limit: number = 10,
  // ): Promise<any> {
  //   try {
  //     const interactions = await this.interactionModel
  //       .find({ user_id: userId })
  //       .exec();

  //     // Transform data for Flask
  //     const interactionData = interactions.map((interaction) => ({
  //       user_id: interaction.user_id,
  //       item_id: interaction.item_id,
  //       interaction_value: interaction.interaction_value, // 1 for "interacted"
  //     }));

  //     // Send data to Flask for recommendations
  //     const flaskResponse = await this.httpService
  //       .post('http://localhost:5000/recommendations', {
  //         user_id: userId,
  //         interactions: interactionData, // Pass interactions for this user
  //       })
  //       .toPromise();

  //     // Parse recommendations from Flask
  //     const recommendations = flaskResponse.data.recommendations;

  //     // Extract the recommended item IDs
  //     const recommendedItemIds = recommendations.map((rec) => rec.item_id);

  //     // Paginate recommended item IDs
  //     const skip = (page - 1) * limit;
  //     const paginatedItemIds = recommendedItemIds.slice(skip, skip + limit);

  //     // Fetch article details for the paginated recommended items
  //     const articles = await this.articleModel
  //       .find({ article_id: { $in: paginatedItemIds } })
  //       .exec();

  //     // Combine articles with recommendation scores
  //     const paginatedRecommendations = articles.map((article) => ({
  //       ...article.toObject(),
  //       score:
  //         recommendations.find((rec) => rec.item_id === article.article_id)
  //           ?.score || 0,
  //     }));

  //     return {
  //       articles: paginatedRecommendations,
  //       totalCount: recommendedItemIds.length,
  //       currentPage: page,
  //       totalPages: Math.ceil(recommendedItemIds.length / limit),
  //     };
  //   } catch (error) {
  //     console.error('Error fetching recommendations:', error);
  //     throw error;
  //   }
  // }

  async getRecommendationsForUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<any> {
    try {
      // Fetch user interactions
      const interactions = await this.interactionModel
        .find({ user_id: userId })
        .exec();

      if (interactions.length === 0) {
        // If no interactions, fetch popular articles
        return await this.findPopularArticles(page, limit, true);
      }

      // Transform interactions for Flask
      const interactionData = interactions.map((interaction) => ({
        user_id: interaction.user_id,
        item_id: interaction.item_id,
        interaction_value: interaction.interaction_value, // 1 for "interacted"
      }));

      // Send data to Flask for recommendations
      const flaskResponse = await this.httpService
        .post('http://localhost:5000/recommendations', {
          user_id: userId,
          interactions: interactionData,
        })
        .toPromise();

      // Parse recommendations from Flask
      const recommendations = flaskResponse.data.recommendations;

      // Extract recommended item IDs
      const recommendedItemIds = recommendations.map((rec) => rec.item_id);

      // Paginate recommended item IDs
      const skip = (page - 1) * limit;
      const paginatedItemIds = recommendedItemIds.slice(skip, skip + limit);

      // Fetch article details for the paginated recommended items
      const articles = await this.articleModel
        .find({ article_id: { $in: paginatedItemIds } })
        .exec();

      // Combine articles with recommendation scores
      const paginatedRecommendations = articles.map((article) => ({
        ...article.toObject(),
        score:
          recommendations.find((rec) => rec.item_id === article.article_id)
            ?.score || 0,
      }));

      return {
        articles: paginatedRecommendations,
        totalCount: recommendedItemIds.length,
        currentPage: page,
        totalPages: Math.ceil(recommendedItemIds.length / limit),
      };
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  async getArticlesForUser(
    userId: string,
    page: number = 1,
    limit: number = 10,
    prioritizePopular: boolean = false,
    topN: number = 6,
  ): Promise<ApiResponse<Article[]>> {
    try {
      // Fetch user interactions
      const userInteractions = await this.interactionModel
        .find({ user_id: userId })
        .exec();

      if (userInteractions.length > 0) {
        // User has interactions, fetch recommendations
        const recommendations = await this.getRecommendationsForUser(userId);

        // Apply pagination to recommendations
        const skip = (page - 1) * limit;
        const paginatedRecommendations = recommendations.slice(
          skip,
          skip + limit,
        );

        return generateSuccessResponse(
          paginatedRecommendations,
          'Recommended articles fetched successfully',
        );
      }

      // If no interactions, fetch popular articles
      const popularArticles = await this.findPopularArticles(
        page,
        limit,
        prioritizePopular,
        topN,
      );

      return generateSuccessResponse(
        popularArticles.data,
        popularArticles.message,
      );
    } catch (error) {
      console.error('Error fetching articles for user:', error);
      throw new Error('Failed to fetch articles.');
    }
  }

  async retrainModel(): Promise<any> {
    try {
      // Step 1: Fetch all interactions from MongoDB (or any DB you're using)
      const interactions = await this.interactionModel.find().exec();

      // Step 2: Transform the data into the expected format for Flask
      const formattedInteractions = interactions.map((interaction) => ({
        user_id: interaction.user_id,
        item_id: interaction.item_id,
        interaction_value: interaction.interaction_value, // 1 for interacted
      }));

      // Step 3: Send the interactions to Flask for retraining
      const response = await lastValueFrom(
        this.httpService.post('http://localhost:5000/retrain-model', {
          interactions: formattedInteractions, // Payload sent to Flask
        }),
      );

      return response.data; // Return Flask's response
    } catch (error) {
      console.error('Error retraining model:', error.message);
      throw error;
    }
  }
}
