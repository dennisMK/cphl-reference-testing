"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetUserPassword } from "@/lib/auth-client";

const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    const errorParam = searchParams.get("error");
    
    if (errorParam === "invalid_token") {
      setServerError("Invalid or expired reset link. Please request a new one.");
    } else if (tokenParam) {
      setToken(tokenParam);
    } else {
      setServerError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) {
      setServerError("Invalid reset token");
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      const result = await resetUserPassword({
        newPassword: data.newPassword,
        token,
      });

      if (result.error) {
        setServerError(result.error.message || "Failed to reset password");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setServerError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={cn("w-full max-w-md mx-auto bg-white font-['Poppins']", className)} {...props}>
        <div className="bg-white">
          {/* Header with Uganda Flag */}
          <div className="text-center mb-8">
            {/* Uganda Flag */}
            <div className="w-20 h-20 mx-auto mb-8">
              <img 
                src="/uganda.png" 
                alt="Uganda Flag" 
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl font-semibold text-gray-900 mb-3">
              Password reset successfully
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Your password has been updated
            </p>
          </div>

          {/* Success Message */}
          <div className="mb-8 text-center">
            <p className="text-gray-600 mb-6">
              You can now sign in with your new password.
            </p>
            
            <Button
              onClick={() => router.push("/auth/login")}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Continue to sign in
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("w-full max-w-md mx-auto bg-white font-['Poppins']", className)} {...props}>
      <div className="bg-white">
        {/* Header with Uganda Flag */}
        <div className="text-center mb-8">
          {/* Uganda Flag */}
          <div className="w-20 h-20 mx-auto mb-8">
            <img 
              src="/uganda.png" 
              alt="Uganda Flag" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 mb-3">
            Reset your password
          </h1>
          <p className="text-lg text-gray-600">
            Enter your new password below
          </p>
        </div>

        {/* Form Container - Apple Style Grouped Inputs */}
        <div className="mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* New Password Field */}
            <div className="mb-4">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="newPassword" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    New Password
                  </Label>
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    placeholder=""
                    className={cn(
                      "h-16 px-4 pt-6 pb-2 pr-12 border-0 rounded-2xl focus:ring-0 focus:border-0 text-gray-900 text-lg bg-transparent",
                      errors.newPassword && "bg-red-50"
                    )}
                    {...register("newPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-600 mt-2 ml-1">{errors.newPassword.message}</p>
              )}
            </div>
            
            {/* Confirm Password Field */}
            <div className="mb-6">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="confirmPassword" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder=""
                    className={cn(
                      "h-16 px-4 pt-6 pb-2 pr-12 border-0 rounded-2xl focus:ring-0 focus:border-0 text-gray-900 text-lg bg-transparent",
                      errors.confirmPassword && "bg-red-50"
                    )}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-2 ml-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="mb-6">
                <p className="text-sm text-red-600 ml-1">{serverError}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !token}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 mb-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting password...
                </>
              ) : (
                "Reset password"
              )}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="text-center">
            <Link
              href="/auth/login"
              className="text-black hover:text-gray-700 font-medium"
            >
              ← Back to sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          Need help?{" "}
          <a href="#" className="underline hover:text-gray-600">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
} 