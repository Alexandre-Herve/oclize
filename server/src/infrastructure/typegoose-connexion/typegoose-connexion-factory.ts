import { ConfigService } from '@nestjs/config'

export const typegooseConnexionFactory = async (
  configService: ConfigService,
) => {
  const port = configService.get<string>('MONGODB_PORT', '27017')
  const host = configService.get<string>('MONGODB_HOST', 'localhost')
  const username = configService.get<string>('MONGODB_USERNAME', 'admin')
  const password = configService.get<string>('MONGODB_PASSWORD', 'password')
  const dbname = configService.get<string>('MONGODB_DATABASE', 'oclize')
  const uri = `mongodb://${username}:${password}@${host}:${port}/${dbname}`
  return {
    uri,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    autoIndex: true,
  }
}
