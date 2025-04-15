import { NextResponse } from "next/server";
import connect from "@/lib/db";
import User from "@/lib/modals/user";
import Category from "@/lib/modals/category";
import { Types } from "mongoose";
import { URL } from "url";
import Blog from "@/lib/modals/blog";

// export const GET = async (req: Request, context: { params: any }) 
// const blogId = context.params.blog;
export const GET = async (req: Request,  { params }: { params: Promise<{ blog: string; }>  }) => {
  const blogId = (await params).blog;
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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json("Missing blogId or invalid blogId");
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

    const blog = await Blog.findOne({
      _id: blogId,
      user: new Types.ObjectId(userId),
      Category: new Types.ObjectId(categoryId),
    });
    if (!blog) {
      return NextResponse.json("blog not found");
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json("Error in get blog " + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request,  { params }: { params: Promise<{ blog: string; }>  }) => {
  const blogId = (await params).blog;
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { title, description } = await req.json();

    const categoryId = searchParams.get("categoryId");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json("Missing userId or invalid userId");
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json("Missing categoryId or invalid categoryId");
    }

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json("Missing blogId or invalid blogId");
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

    const updateBlog = await Blog.findByIdAndUpdate(
      blogId,
      { title, description },
      { new: true }
    );
    return NextResponse.json(updateBlog);
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json("Error in update blog " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request,  { params }: { params: Promise<{ blog: string; }>  }) => {
  const blogId = (await params).blog;
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

    if (!blogId || !Types.ObjectId.isValid(blogId)) {
      return NextResponse.json("Missing blogId or invalid blogId");
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

    const deleteBlog = await Blog.findByIdAndDelete(blogId);
    return NextResponse.json("blog deleted successfully");
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json("Error in delete blog " + error.message, {
      status: 500,
    });
  }
};
