import connect from "@/lib/db";
import User from "@/lib/modals/user";
import { NextResponse } from "next/server";
import { Types } from "mongoose";
import Category from "@/lib/modals/category";

export const GET = async (req: Request, res: Response) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({
        status: 400,
        message: "Missing userId parameter",
      });
    }

    await connect();
    // const user = await User.findById(userId);
    // if (!user) {
    //   return NextResponse.json("user not found");
    // }

    //found category with user id
    const categories = await Category.find({
      user: new Types.ObjectId(userId),
    });

    return NextResponse.json(categories);
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json("Error in get user's category: " + error.message, {
      status: 500,
    });
  }
};

export const POST = async (req: Request) => {
  try {
    // const body = req.body;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const { title } = await req.json();

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json("Missing userId or invalid userId");
    }

    if (!title) {
      return NextResponse.json("add title");
    }
    await connect();

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json("user not found");
    }
    const newCategory = new Category(
      {
        title,
        user: new Types.ObjectId(userId),
      },
    );
    await newCategory.save();

    return NextResponse.json(newCategory);
  } catch (error: any) {
    console.log("error", error);
    return NextResponse.json("Error in creating category " + error.message, {
      status: 500,
    });
  }
};