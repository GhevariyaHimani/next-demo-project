import connect from "@/lib/db";
import { NextResponse } from "next/server";
import User from "@/lib/modals/user";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";
import { types } from "node:util";
import { use } from "react";

// export const PATCH = async (req: Request, context: { params: { categoryId: string } }) => {
// const categoryId = context.params.categoryId; // part of url category/categoryId dynamic path
export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ categoryId: string }> }
) => {
  const categoryId = (await params).categoryId; // part of url category/categoryId dynamic path
  try {
    const { title } = await req.json();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json("Missing userId or invalid userId");
    }

    if (!title) {
      return NextResponse.json("Missing title");
    }

    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json("Missing categoryId or invalid categoryId");
    }

    await connect();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json("user not found");
    }

    const category = await Category.findOne({ _id: categoryId, user: userId });
    if (!category) {
      return NextResponse.json("category not found");
    }

    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    return NextResponse.json(updateCategory);
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json("Error in update category " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request, { params }: { params: Promise<{ categoryId: string }> }) => {
  const categoryId = (await params).categoryId;
  try {
    if (!categoryId || !Types.ObjectId.isValid(categoryId)) {
      return NextResponse.json("Missing categoryId or invalid categoryId");
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json("Missing userId or invalid userId");
    }

    await connect();

    // const user = await User.findById(userId);
    // const category = await Category.findOne({ _id: categoryId, user: userId });
    await Category.findByIdAndDelete(categoryId);
    return NextResponse.json("category deleted successfully");
  
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json("Error in delete category " + error.message, {
      status: 500,
    });
  }
};
