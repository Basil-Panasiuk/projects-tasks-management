import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { dataSource } from './db/data-source';
import { IamModule } from './iam/iam.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(dataSource.uri, dataSource.options),
    IamModule,
    ProjectsModule,
    TasksModule,
  ],
})
export class AppModule {}
