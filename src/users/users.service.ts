import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentType, User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

    async findOne(email: string): Promise<UserDocument | undefined> {
        return this.userModel.findOne({ email });
    }

    async findByDocument(document: string, documentType: DocumentType): Promise<UserDocument | undefined> {
        return this.userModel.findOne({ document, documentType });
    }

    async create(user: User): Promise<UserDocument> {
        return this.userModel.create(user);
    }
}
