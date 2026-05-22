import mongoose, { Schema } from 'mongoose';

import { connectTODB } from '../../lib/conn';

connectTODB();

const ChatListSchema = new Schema(
  {
    inputText: {
      type: String,
      trim: true,
    },
    responseText: {
      type: String,
      trim: true,
    },
    lang: {
      type: String,
      default: null,
    },
  },
  { timestamps: true, versionKey: false }
);

export default
  mongoose.models.ChatLists || mongoose.model('ChatLists', ChatListSchema);
