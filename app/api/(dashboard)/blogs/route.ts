import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import { URL } from "url";
import Blog from "@/lib/modals/blog";

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json("Missing userId or invalid userId");
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json("Missing categoryId or invalid categoryId");
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json("User not found");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json("category not found");
    }

    const filter: any = {
      user: new Types.ObjectId(userId),
      category: new Types.ObjectId(categoryId),
    };

    const blogs = await Blog.find(filter);
    return NextResponse.json(blogs);
  } catch (error: unknown) {
    console.log("error", error);
    return NextResponse.json("Error in get blogs ", {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const categoryId = searchParams.get("categoryId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json("Missing userId or invalid userId");
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json("Missing categoryId or invalid categoryId");
    }

    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json("User not found");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      return NextResponse.json("category not found");
    }

    const { title, description } = await req.json();
    const newBlog = new Blog({
      title,
      description,
      user: new Types.ObjectId(userId),
      Category: new Types.ObjectId(categoryId),
    });

    await newBlog.save();

    return NextResponse.json(newBlog);
  } catch (error: unknown) {
    console.log("error", error);
    return NextResponse.json("Error in create blogs ", {
      status: 500,
    });
  }
};
