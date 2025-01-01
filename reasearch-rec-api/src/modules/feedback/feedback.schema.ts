import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FeedbackStatus } from 'src/common/constants/feedback.constants';

export type UnlabelledFeedbackDocument = UnlabelledFeedback & Document;

@Schema({ timestamps: true })
export class UnlabelledFeedback {
  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  item_id: string; // Reference to `Article`

  @Prop({ required: true })
  uncertainty: number;

  @Prop({ required: true })
  popularity: number;

  @Prop({ required: true })
  hybrid_score: number;

  @Prop({
    type: String,
    enum: Object.values(FeedbackStatus),
    default: FeedbackStatus.PENDING,
  })
  status: string;
}

export const UnlabelledFeedbackSchema =
  SchemaFactory.createForClass(UnlabelledFeedback);
