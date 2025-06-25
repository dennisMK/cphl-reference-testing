"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Palette, TestTube, Baby } from "lucide-react";
import { useTheme } from "@/lib/theme-context";

interface User {
  id: number;
  username: string;
  name: string;
  email: string | null;
  facility_id: number | null;
  facility_name: string | null;
  hub_id: number | null;
  hub_name: string | null;
}

export default function SettingsPage() {
  const { viralLoadColors, eidColors, updateColors } = useTheme();
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" });
      setIsLoading(false);
      return;
    }

    // Validate password length
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: result.message || "Password changed successfully" });
        // Reset form
        e.currentTarget.reset();
      } else {
        setMessage({ type: "error", text: result.error || "Failed to change password" });
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const facility_name = formData.get("facility_name") as string;

    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email: email || null,
          facility_name: facility_name || null,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUser(result.user);
        setMessage({ type: "success", text: "Profile updated successfully" });
      } else {
        setMessage({ type: "error", text: result.error || "Failed to update profile" });
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      setMessage({ type: "error", text: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
   <main className="md:container mx-auto px-4 py-6">
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account and application preferences.</p>
      </div>

      {/* Success/Error Messages */}
      {message && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === "success" 
            ? "bg-green-50 text-green-800 border border-green-200" 
            : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          <p className="text-sm font-medium">{message.text}</p>
          <button 
            onClick={() => setMessage(null)}
            className="mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "profile"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Profile
          </button>
        
          <button
            onClick={() => setActiveTab("security")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "security"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Security
          </button>
          
          <button
            onClick={() => setActiveTab("themes")}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === "themes"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Color Themes
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === "profile" && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-600">Update your account profile information.</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleProfileUpdate}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    name="name"
                    type="text"
                    defaultValue={user?.name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    name="username"
                    type="text"
                    defaultValue={user?.username || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    readOnly
                  />
                  <p className="mt-1 text-sm text-gray-500">Username cannot be changed</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address (Optional)
                  </label>
                  <input
                    name="email"
                    type="email"
                    defaultValue={user?.email || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facility Name (Optional)
                  </label>
                  <input
                    name="facility_name"
                    type="text"
                    defaultValue={user?.facility_name || ""}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button 
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {activeTab === "security" && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Security Settings</h2>
            <p className="text-sm text-gray-600">Manage your account security.</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Change Password</h3>
                <form onSubmit={handlePasswordChange}>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        name="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Current Password"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        name="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="New Password (min 6 characters)"
                        minLength={6}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm New Password"
                        minLength={6}
                        className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                        )}
                      </button>
                    </div>
                  </div>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "themes" && (
        <div className="space-y-6">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Color Themes</span>
              </h2>
              <p className="text-sm text-gray-600">Customize colors for different form types</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Viral Load Colors */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <TestTube className="h-5 w-5 text-red-600" />
                    <h3 className="text-md font-semibold text-gray-900">Viral Load Theme</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={viralLoadColors.primary}
                          onChange={(e) => updateColors('viral-load', {
                            ...viralLoadColors,
                            primary: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{viralLoadColors.primary}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hover Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={viralLoadColors.primaryHover}
                          onChange={(e) => updateColors('viral-load', {
                            ...viralLoadColors,
                            primaryHover: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{viralLoadColors.primaryHover}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Light Background
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={viralLoadColors.primaryLight}
                          onChange={(e) => updateColors('viral-load', {
                            ...viralLoadColors,
                            primaryLight: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{viralLoadColors.primaryLight}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dark Text
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={viralLoadColors.primaryDark}
                          onChange={(e) => updateColors('viral-load', {
                            ...viralLoadColors,
                            primaryDark: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{viralLoadColors.primaryDark}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: viralLoadColors.primaryLight }}>
                    <h4 className="font-medium" style={{ color: viralLoadColors.primaryDark }}>Preview</h4>
                    <button 
                      className="mt-2 px-4 py-2 rounded text-white text-sm"
                      style={{ backgroundColor: viralLoadColors.primary }}
                    >
                      Viral Load Button
                    </button>
                  </div>
                </div>

                {/* EID Colors */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2 mb-4">
                    <Baby className="h-5 w-5 text-blue-600" />
                    <h3 className="text-md font-semibold text-gray-900">EID Theme</h3>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Primary Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={eidColors.primary}
                          onChange={(e) => updateColors('eid', {
                            ...eidColors,
                            primary: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{eidColors.primary}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hover Color
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={eidColors.primaryHover}
                          onChange={(e) => updateColors('eid', {
                            ...eidColors,
                            primaryHover: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{eidColors.primaryHover}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Light Background
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={eidColors.primaryLight}
                          onChange={(e) => updateColors('eid', {
                            ...eidColors,
                            primaryLight: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{eidColors.primaryLight}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dark Text
                      </label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="color"
                          value={eidColors.primaryDark}
                          onChange={(e) => updateColors('eid', {
                            ...eidColors,
                            primaryDark: e.target.value
                          })}
                          className="w-12 h-8 rounded border border-gray-300"
                        />
                        <span className="text-sm text-gray-600">{eidColors.primaryDark}</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Preview */}
                  <div className="mt-4 p-4 rounded-lg border" style={{ backgroundColor: eidColors.primaryLight }}>
                    <h4 className="font-medium" style={{ color: eidColors.primaryDark }}>Preview</h4>
                    <button 
                      className="mt-2 px-4 py-2 rounded text-white text-sm"
                      style={{ backgroundColor: eidColors.primary }}
                    >
                      EID Button
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Reset to Defaults */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={() => {
                    updateColors('viral-load', {
                      primary: '#dc2626',
                      primaryHover: '#b91c1c',
                      primaryLight: '#fef2f2',
                      primaryDark: '#991b1b',
                    });
                    updateColors('eid', {
                      primary: '#2563eb',
                      primaryHover: '#1d4ed8',
                      primaryLight: '#eff6ff',
                      primaryDark: '#1e40af',
                    });
                    setMessage({ type: "success", text: "Color themes reset to defaults" });
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
                >
                  Reset to Default Colors
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
   </main>
  );
} 