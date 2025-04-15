import connect from "@/lib/db";
import User from "@/lib/modals/user";
// for validation upon Id
const objectId = require("mongoose").Types.ObjectId;
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    await connect();
    const users = await User.find();

    return new NextResponse(JSON.stringify(users), { status: 200 });
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse(`Error in fetching users data: ${error.message}`, {
      status: 500,
    });
  }
};

export const POST = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    await connect();

    const newUser = new User(body);
    await newUser.save(); //save in database

    // NextResponse.json response
    return NextResponse.json(
      { message: "User Created", user: newUser },
      { status: 200 }
    );

  } catch (error: any) {
    return new NextResponse("Error in creating user:" + error.message, {
      status: 500,
    });
  }
};

export const PATCH = async (req: Request, res: Response) => {
  try {
    const body = await req.json();
    const { userId, newUsername } = body;
    await connect();
    if (!userId || !newUsername) {
      return new NextResponse("Id and username not found", {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse("userId is not valid", {
        status: 400,
      });
    }
    const updateUser = await User.findOneAndUpdate(
      { _id: new objectId(userId) },
      { username: newUsername },
      { new: true }
    );

    if (!updateUser) {
      return new NextResponse("User not found", {
        status: 404,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "User is updated", user: updateUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Error in updating user data: " + error.message, {
      status: 500,
    });
  }
};

export const DELETE = async (req: Request, res: Response) => {
  try {
    // get data from search params
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("id is not valid", {
        status: 400,
      });
    }

    if (!Types.ObjectId.isValid(userId)) {
      return new NextResponse(JSON.stringify({ message: "Invalid user id" }), {
        status: 400,
      });
    }

    await connect();

    const deleteUser = await User.findByIdAndDelete(new objectId(userId));

    if (!deleteUser) {
      return new NextResponse(JSON.stringify({ message: "user not found" }), {
        status: 400,
      });
    }

    return new NextResponse(
      JSON.stringify({ message: "user is deleted", user: deleteUser }),
      { status: 200 }
    );
  } catch (error: any) {
    console.log("error", error);
    return new NextResponse("Error in updating user data: " + error.message, {
      status: 500,
    });
  }
};
