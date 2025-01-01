import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InteractionDocument = Interaction & Document;

@Schema({ timestamps: true })
export class Interaction {
  @Prop({ required: true })
  user_id: string; // User ID performing the interaction

  @Prop({ required: true })
  item_id: string; // Article ID being interacted with

  @Prop({ required: true })
  interaction_type: string; // E.g., "read_more", "view_details"

  @Prop({ default: Date.now })
  timestamp: Date; // Timestamp of the interaction

  @Prop({ required: true })
  interaction_value: number; // Binary (1: meaningful interaction, 0: not meaningful)
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);
