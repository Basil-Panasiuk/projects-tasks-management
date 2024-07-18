import { MongooseModuleOptions } from '@nestjs/mongoose';
import { config } from 'dotenv';

config();

interface MongooseSource {
  uri: string;
  options: MongooseModuleOptions;
}

export const dataSource: MongooseSource = {
  uri: process.env.DATABASE_URI,
  options: {
    dbName: process.env.DATABASE_NAME,
    auth: {
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
    },
  },
};
