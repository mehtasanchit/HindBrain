import dotenv from 'dotenv';
import path from 'path';
import { User, Tag, Content, Link } from './db';
dotenv.config({ path: path.resolve(__dirname, '../.env') });
export const JWT_USER_PASSWORD = process.env.JWT_USER_PASSWORD||"defaultpassword";

