import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from './config/config.module';
import { AppConfigService } from './config/config.service';
import { ArticlesModule } from './modules/articles/articles.module';
import { AuthModule } from './modules/auth/auth.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { FlaskModule } from './modules/flask/flask.module';
import { InteractionsModule } from './modules/interactions/interactions.module';
import { ModelModule } from './modules/model/model.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [AppConfigModule],
      useFactory: async (configService: AppConfigService) => ({
        uri: configService.mongoUri,
      }),
      inject: [AppConfigService],
    }),
    AuthModule,
    UsersModule,
    FeedbackModule,
    FlaskModule,
    InteractionsModule,
    ModelModule,
    ArticlesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
