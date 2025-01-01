import { Module } from '@nestjs/common';
import { InteractionsService } from './interactions.service';
import { InteractionsController } from './interactions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Interaction, InteractionSchema } from './interaction.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interaction.name, schema: InteractionSchema },
    ]),
    HttpModule,
  ],
  providers: [InteractionsService],
  controllers: [InteractionsController],
  exports: [MongooseModule, InteractionsService],
})
export class InteractionsModule {}
