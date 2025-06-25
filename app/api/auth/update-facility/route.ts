import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { getUsersDb } from "@/server/db";
import { users } from "@/server/db/schemas/users";
import { getAuthToken, verifyJWT } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    // Get the token from cookies
    const token = await getAuthToken();

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = verifyJWT(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.id;

    // Parse the request body
    const body = await request.json();
    const { facility_name, hub_name, facility_id, hub_id } = body;

    // Validate required fields
    if (!facility_name || !hub_name) {
      return NextResponse.json(
        { error: "Facility name and hub name are required" },
        { status: 400 }
      );
    }

    // Get database connection
    const db = await getUsersDb();

    const updateData = {
      facility_name: facility_name.trim(),
      hub_name: hub_name.trim(),
      facility_id: facility_id ? parseInt(facility_id) : null,
      hub_id: hub_id ? parseInt(hub_id) : null,
    };

    // Update the user's facility information
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    // Fetch the updated user data
    const updatedUserResult = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (updatedUserResult.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Return the updated user data (excluding password)
    const updatedUser = updatedUserResult[0];
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create user object without password for response
    const userResponse = {
      id: updatedUser.id,
      username: updatedUser.username,
      name: updatedUser.name,
      email: updatedUser.email,
      facility_id: updatedUser.facility_id,
      facility_name: updatedUser.facility_name,
      hub_id: updatedUser.hub_id,
      hub_name: updatedUser.hub_name,
      deactivated: updatedUser.deactivated,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
    };

    return NextResponse.json({
      success: true,
      message: "Facility information updated successfully",
      user: userResponse,
    });

  } catch (error) {
    console.error("Update facility error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 