import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Project } from 'src/projects/schemas/project.schema';
import { Task } from 'src/tasks/schemas/task.schema';

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Task' })
  tasks: Task[];

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Project' })
  projects: Project[];
}

export const UserSchema = SchemaFactory.createForClass(User);
