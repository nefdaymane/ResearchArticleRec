import { Module } from '@nestjs/common';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { ModelVersion, ModelVersionSchema } from './model.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ModelVersion.name, schema: ModelVersionSchema },
    ]),
  ],
  providers: [ModelService],
  controllers: [ModelController],
})
export class ModelModule {}
