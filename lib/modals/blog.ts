import { model, models, Schema } from "mongoose";

const BlogSchema = new Schema(
  {
    title: {
      type: "string",
      required: true,
    },
    description: {
      type: "string",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    Category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
  },
  {
    timestamps: true,
  }
);

const Blog = models.Blog || model("Blog", BlogSchema);

export default Blog;
