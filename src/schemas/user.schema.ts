import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRoles {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export enum DocumentType {
  CC = 'cc',
  CE = 'ce',
  TI = 'ti',
  PP = 'pp',
}

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, maxlength: 50 })
  firstName: string;

  @Prop({ required: true, maxlength: 50 })
  lastName: string;

  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ required: true, unique: true, trim: true })
  email: string;

  @Prop({ trim: true })
  phone: string;

  @Prop()
  address: string;

  @Prop({ unique: true })
  document: string;

  @Prop()
  documentType: DocumentType;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, default: UserRoles.USER })
  role?: UserRoles;
}

export const UserSchema = SchemaFactory.createForClass(User);
