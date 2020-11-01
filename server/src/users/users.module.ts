import { Module } from '@nestjs/common'
import { UsersRepositoryService } from './users-repository.service'
import { UsersController } from './users.controller'
import { User } from './model/user'
import { TypegooseModule } from 'nestjs-typegoose'

@Module({
  providers: [UsersRepositoryService],
  exports: [UsersRepositoryService],
  controllers: [UsersController],
  imports: [TypegooseModule.forFeature([User])],
})
export class UsersModule {}
