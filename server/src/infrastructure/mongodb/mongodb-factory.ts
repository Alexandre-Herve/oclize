import { MongoClient, Db } from 'mongodb'
import { ConfigService } from '@nestjs/config'

const getMongoUri = (configService: ConfigService): string => {
  const port = configService.get<string>('MONGODB_PORT', '27017')
  const host = configService.get<string>('MONGODB_HOST', 'localhost')
  const username = configService.get<string>('MONGODB_USERNAME', 'admin')
  const password = configService.get<string>('MONGODB_PASSWORD', 'password')
  const dbname = configService.get<string>('MONGODB_DATABASE', 'oclize')
  return `mongodb://${username}:${password}@${host}:${port}/${dbname}`
}

export const mongdbFactory = async (
  configService: ConfigService,
): Promise<Db> => {
  const uri = getMongoUri(configService)
  const options = { useUnifiedTopology: true }
  const dbname = configService.get<string>('MONGODB_DATABASE', 'oclize')

  const client = await MongoClient.connect(uri, options)

  const db = client.db(dbname)

  // TODO move in respective module
  await db.collection('users').createIndex(
    { email: 1 },
    { unique: true, sparse: true }
  );

  return db
}
