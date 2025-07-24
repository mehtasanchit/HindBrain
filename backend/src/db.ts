import mongoose, { Schema, Types } from "mongoose";

const Userschema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
export const User = mongoose.model('User', Userschema);

const TagSchema = new Schema({
    title: { type: String, required: true, unique: true }
});
export const Tag = mongoose.model('Tag', TagSchema);

const contentTypes: string[] = ['image', 'video', 'article', 'audio', 'twitter', 'youtube'];

const ContentSchema= new Schema({
  link: { type: String, required: true },
  type: {
    type: String,
    enum: contentTypes,
    required: true
  },
  title: { type: String, required: true },
  tags: [{ type: Types.ObjectId, ref: 'Tag', required: true }],
  userId: { type: Types.ObjectId, ref: 'User', required: true }
});
 export const Content = mongoose.model('Content', ContentSchema);


const linkSchema = new Schema({
    hash: { type: String, required: true },
    userId: { type: Types.ObjectId, ref: 'User', required: true,unique:true }
});
export const Link = mongoose.model('Link', linkSchema);