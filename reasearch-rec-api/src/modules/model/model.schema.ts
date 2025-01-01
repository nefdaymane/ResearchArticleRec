import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModelVersionDocument = ModelVersion & Document;

@Schema({ timestamps: true })
export class ModelVersion {
  @Prop({ required: true })
  version: string; // e.g., 'v1.0'

  @Prop({ required: true })
  accuracy: number; // Model performance metric

  @Prop({ default: Date.now })
  trained_on: Date;

  @Prop({ required: true })
  feedback_used: number; // Number of feedback samples used in training
}

export const ModelVersionSchema = SchemaFactory.createForClass(ModelVersion);
