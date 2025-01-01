import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Interaction, InteractionDocument } from './interaction.schema';
import { CustomHttpException } from 'src/common/filters/custom-http.exception';
import { generateSuccessResponse } from 'src/utils/response.utils';
import { ApiResponse } from 'src/common/interfaces/api-response.interface';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class InteractionsService {
  constructor(
    @InjectModel(Interaction.name)
    private readonly interactionModel: Model<InteractionDocument>,
    private httpService: HttpService,
  ) {}

  private mapInteractionTypeToValue(interactionType: string): number {
    switch (interactionType) {
      case 'read_more':
        return 1; // Positive interaction
      case 'like':
        return 2; // Stronger positive interaction
      case 'dislike':
        return -1; // Negative interaction
      default:
        return 0; // No interaction or not meaningful
    }
  }

  // Log a new interaction
  async logInteraction(
    user_id: string,
    item_id: string,
    interaction_type: string,
  ): Promise<Interaction> {
    const interaction_value = this.mapInteractionTypeToValue(interaction_type);

    const interaction = new this.interactionModel({
      user_id,
      item_id,
      interaction_type,
      interaction_value,
    });

    return interaction.save();
  }

  // Aggregate interactions for a user
  async aggregateInteractions(user_id: string): Promise<any> {
    return this.interactionModel.aggregate([
      { $match: { user_id, interaction_value: 1 } },
      {
        $group: {
          _id: '$item_id',
          total_interactions: { $sum: 1 },
        },
      },
    ]);
  }

  async findAllInteractions(): Promise<ApiResponse<Interaction[]>> {
    const interactions = await this.interactionModel.find();

    if (!interactions) {
      throw new CustomHttpException('No interactions found', 404);
    }

    return generateSuccessResponse(
      interactions,
      'Interactions retrieved successfully',
    );
  }

  async logInteractionsToFlask(userId: string): Promise<void> {
    try {
      const interactions = await this.interactionModel
        .find({ user_id: userId })
        .exec();

      console.log('Fetched interactions:', interactions);

      const interactionMap = new Map<string, number>();

      interactions.forEach((interaction) => {
        const key = `${interaction.user_id}-${interaction.item_id}`;
        const currentScore = interactionMap.get(key) || 0;

        interactionMap.set(key, currentScore + interaction.interaction_value);
      });

      console.log('Aggregated interaction map:', interactionMap);

      const interactionData = Array.from(interactionMap.entries()).map(
        ([key, score]) => {
          const [user_id, item_id] = key.split('-');

          console.log(
            `Processed: user_id=${user_id}, item_id=${item_id}, aggregated_score=${score}`,
          );

          return {
            user_id,
            item_id,
            interaction_value: score,
          };
        },
      );

      console.log('Final interaction data to send to Flask:', interactionData);

      // Send the interaction data to Flask
      await this.httpService
        .post('http://localhost:5000/log-interactions', {
          user_id: userId,
          interactions: interactionData,
        })
        .toPromise();

      console.log('Interactions successfully sent to Flask');
    } catch (error) {
      console.error('Error sending interactions to Flask:', error);
      throw error;
    }
  }
}
