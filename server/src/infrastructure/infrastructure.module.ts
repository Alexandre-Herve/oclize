import { Module } from '@nestjs/common'
import { TypegooseConnexionModule } from './typegoose-connexion/typegoose-connexion.module'

@Module({
  imports: [TypegooseConnexionModule],
})
export class InfrastructureModule {}
