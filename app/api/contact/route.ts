import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Message from "@/models/Message";
import { isAuthenticated } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields (name, email, message) are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (!process.env.MONGODB_URI) {
      console.warn("MONGODB_URI is not set. Contact message not persisted to database.");
      return NextResponse.json({
        success: true,
        message: "Thank you for reaching out! (Database offline preview mode)",
      });
    }

    await connectToDatabase();
    const newMsg = await Message.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    return NextResponse.json(
      { success: true, message: "Thank you for contacting me! I'll get back to you soon.", id: newMsg._id },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error saving contact message:", error);
    const message = error instanceof Error ? error.message : "Failed to submit message";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const auth = await isAuthenticated();
    if (!auth) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (!process.env.MONGODB_URI) {
      return NextResponse.json({
        success: true,
        messages: [],
        warning: "MONGODB_URI is not set",
      });
    }

    await connectToDatabase();
    const messages = await Message.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, messages });
  } catch (error: unknown) {
    console.error("Error retrieving contact messages:", error);
    const message = error instanceof Error ? error.message : "Failed to retrieve messages";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
