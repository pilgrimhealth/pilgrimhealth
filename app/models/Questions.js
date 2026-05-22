import mongoose, { Schema } from "mongoose";

import {  connectTODB } from "../../lib/conn";

connectTODB();

const QuestionSchema = new Schema({
  category : { type: String, required: true },
  question : { type: String, required: true },
  answer : { type: String, required: true },
});

export default
  mongoose.models.Questions || mongoose.model("Questions", QuestionSchema);