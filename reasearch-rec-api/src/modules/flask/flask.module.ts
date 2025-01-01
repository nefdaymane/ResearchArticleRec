import { Module } from '@nestjs/common';
import { FlaskService } from './flask.service';
import { FlaskController } from './flask.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [FlaskService],
  controllers: [FlaskController],
  exports: [FlaskService],
})
export class FlaskModule {}
