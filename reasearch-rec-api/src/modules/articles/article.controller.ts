import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FlaskService } from '../flask/flask.service';
import { ArticlesService } from './article.service';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { Article } from './article.schema';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private flaskService: FlaskService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads', // Directory to save uploaded files
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(csv)$/)) {
          return callback(
            new BadRequestException('Only CSV files are allowed!'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async uploadDataset(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded!');
    }

    const result = await this.articlesService.uploadDataset(file.path);
    return {
      message: 'Dataset upload complete',
      success: result.success,
      failed: result.failed,
    };
  }
  @Post('find-all')
  async findAllArticles(@Body() body: { page?: number; limit?: number }) {
    const { page = 1, limit = 10 } = body;

    if (page < 1 || limit < 1) {
      throw new BadRequestException('Page and limit must be greater than 0');
    }

    return this.articlesService.findAllArticles(page, limit);
  }

  @Post('all')
  async findAllArticlesWithPopularity(
    @Body('page') page: number = 1,
    @Body('limit') limit: number = 10,
    @Body('prioritizePopular') prioritizePopular: boolean = false,
  ) {
    return this.articlesService.findPopularArticles(
      page,
      limit,
      prioritizePopular,
    );
  }

  @Get('article/:articleId')
  async getArticle(@Param('articleId') articleId: string) {
    return this.articlesService.findArticleById(articleId);
  }

  @Post('recommendations')
  async getRecommendations(
    @Body('user_id') userId: string,
    @Body('page') page: number = 1,
    @Body('limit') limit: number = 10,
  ) {
    return await this.articlesService.getRecommendationsForUser(
      userId,
      page,
      limit,
    );
  }

  @Post('articles-for-user')
  async getArticlesForUser(
    @Body()
    body: {
      userId: string;
      page?: number;
      limit?: number;
      prioritizePopular?: boolean;
    },
  ): Promise<ApiResponse<Article[]>> {
    const { userId, page = 1, limit = 10, prioritizePopular = false } = body;

    return this.articlesService.getArticlesForUser(
      userId,
      page,
      limit,
      prioritizePopular,
    );
  }

  @Post('retrain-model')
  async retrainModel(): Promise<any> {
    return await this.articlesService.retrainModel();
  }
}
