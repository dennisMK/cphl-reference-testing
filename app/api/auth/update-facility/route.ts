import { NextRequest, NextResponse } from "next/server";
import { eq, sql } from "drizzle-orm";
import { getUsersDb } from "@/server/db";
import { users } from "@/server/db/schemas/users";
import { getAuthToken, verifyJWT } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    console.log("🏥 Update facility request received");
    
    // Get the token from cookies
    const token = await getAuthToken();

    if (!token) {
      console.log("🍪 Token found: No");
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }
    
    console.log("🍪 Token found: Yes");

    // Verify the token
    const payload = verifyJWT(token);
    
    if (!payload) {
      console.log("🔐 Token payload: Invalid");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    const userId = payload.id;
    console.log("🔐 Token payload: User ID:", userId);

    // Parse the request body
    const body = await request.json();
    console.log("📝 Request body:", body);
    const { facility_name, hub_name, facility_id, hub_id } = body;

    // Validate required fields
    if (!facility_name || !hub_name) {
      console.log("❌ Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Facility name and hub name are required" },
        { status: 400 }
      );
    }

    // Get database connection
    const db = await getUsersDb();
    console.log("💾 Database connection established");

    // If facility_id is not provided, generate a unique one
    let finalFacilityId = null;
    
    if (facility_id) {
      // Try to parse the facility_id
      const parsedFacilityId = parseInt(facility_id);
      if (isNaN(parsedFacilityId)) {
        console.log("❌ Invalid facility_id provided:", facility_id);
        return NextResponse.json(
          { error: "Invalid facility ID format" },
          { status: 400 }
        );
      }
      finalFacilityId = parsedFacilityId;
      console.log("✅ Using provided facility ID:", finalFacilityId);
    } else {
      console.log("🔢 Generating new facility ID...");
      // Get the highest existing facility_id
      const maxFacilityResult = await db
        .select({ maxId: sql<number>`MAX(facility_id)` })
        .from(users)
        .where(sql`facility_id IS NOT NULL`);
      
      const maxFacilityId = maxFacilityResult[0]?.maxId || 0;
      finalFacilityId = maxFacilityId + 1;
      console.log("🔢 Generated facility ID:", finalFacilityId);
    }

    // Parse hub_id if provided
    let finalHubId = null;
    if (hub_id) {
      const parsedHubId = parseInt(hub_id);
      if (isNaN(parsedHubId)) {
        console.log("❌ Invalid hub_id provided:", hub_id);
        return NextResponse.json(
          { error: "Invalid hub ID format" },
          { status: 400 }
        );
      }
      finalHubId = parsedHubId;
    }

    const updateData = {
      facility_name: facility_name.trim(),
      hub_name: hub_name.trim(),
      facility_id: finalFacilityId,
      hub_id: finalHubId,
    };

    console.log("📊 Update data:", updateData);

    // Update the user's facility information
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId));

    console.log("✅ Database update completed");

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

    console.log("👤 Updated user data:", { 
      id: updatedUser.id, 
      facility_name: updatedUser.facility_name, 
      facility_id: updatedUser.facility_id 
    });

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