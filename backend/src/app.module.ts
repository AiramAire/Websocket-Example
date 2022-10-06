import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppGateway } from './app.gateway';
import { SavedData } from './data/savedData';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, AppGateway, SavedData],
})
export class AppModule {}
