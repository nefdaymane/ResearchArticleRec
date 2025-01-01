import { Controller, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post(':articleId/calculate')
  async calculateFeedback(@Param('articleId') articleId: string) {
    const result = await this.feedbackService.calculateFeedback(articleId);
    return {
      message: 'Feedback calculated successfully',
      data: result,
    };
  }
}
