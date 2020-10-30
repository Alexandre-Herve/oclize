import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypegooseModule } from 'nestjs-typegoose';

@Module({
  imports: [
    TypegooseModule.forRoot('mongodb://admin:password@mongodb:27017/oclize', {
      useUnifiedTopology: true,
      useNewUrlParser: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
