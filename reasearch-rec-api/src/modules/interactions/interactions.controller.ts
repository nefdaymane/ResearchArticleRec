import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { InteractionsService } from './interactions.service';

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionService: InteractionsService) {}

  @Post('/log')
  async logInteraction(
    @Body('user_id') user_id: string,
    @Body('item_id') item_id: string,
    @Body('interaction_type') interaction_type: string,
  ) {
    return this.interactionService.logInteraction(
      user_id,
      item_id,
      interaction_type,
    );
  }

  @Get('aggregate')
  async getAggregatedInteractions(@Query('user_id') user_id: string) {
    return this.interactionService.aggregateInteractions(user_id);
  }

  @Get()
  async findAllInteractions() {
    return this.interactionService.findAllInteractions();
  }
}
