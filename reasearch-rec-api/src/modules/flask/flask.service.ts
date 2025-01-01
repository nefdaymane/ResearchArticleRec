import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { AxiosResponse } from 'axios';

@Injectable()
export class FlaskService {
  private readonly flaskUrl = 'http://127.0.0.1:5000/';

  constructor(private readonly httpService: HttpService) {}

  async predictPopularity(articleData: any): Promise<any> {
    try {
      const response: AxiosResponse = await this.httpService
        .post(`${this.flaskUrl}/predict-popularity`, articleData)
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        `Flask service error: ${error.response?.data?.error || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getPopularArticles(topN: number): Promise<any> {
    try {
      const response = await this.httpService
        .get(`${this.flaskUrl}/popular-articles?top_n=${topN}`)
        .toPromise();

      // Mappez les item_id aux article_id
      const popularArticles = response.data.data.map((item) => ({
        article_id: item.item_id, // Assurez que Flask retourne l'item_id correspondant
        popularity_score: item.popularity_score,
      }));

      return popularArticles;
    } catch (error) {
      throw new HttpException(
        `Flask service error: ${error.response?.data?.error || error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
