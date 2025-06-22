"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset } from "@/lib/auth-client";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    setServerError("");

    try {
      const result = await requestPasswordReset({
        email: data.email,
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (result.error) {
        setServerError(result.error.message || "Failed to send reset email");
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
              Check your email
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              We've sent a password reset link to
            </p>
            <p className="text-lg font-medium text-gray-900 mb-6">
              {getValues("email")}
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-8 text-center">
            <p className="text-gray-600 mb-4">
              Click the link in the email to reset your password. The link will expire in 1 hour.
            </p>
            <p className="text-gray-600">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                onClick={() => {
                  setIsSuccess(false);
                  setServerError("");
                }}
                className="text-black hover:text-gray-700 font-medium"
              >
                try again
              </button>
            </p>
          </div>

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
            Forgot your password?
          </h1>
          <p className="text-lg text-gray-600">
            Enter your email to get a reset link
          </p>
        </div>

        {/* Form Container - Apple Style */}
        <div className="mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input Container */}
            <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white mb-6">
              <div className="relative">
                <Label 
                  htmlFor="email" 
                  className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder=""
                  className={cn(
                    "h-16 px-4 pt-6 pb-2 border-0 rounded-2xl focus:ring-0 focus:border-0 text-gray-900 text-lg bg-transparent",
                    errors.email && "bg-red-50"
                  )}
                  {...register("email")}
                />
              </div>
            </div>

            {/* Error Messages */}
            {(errors.email || serverError) && (
              <div className="mb-6 space-y-2">
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email.message}</p>
                )}
                {serverError && (
                  <p className="text-sm text-red-600">{serverError}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 mb-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                "Send reset link"
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
          Still having trouble?{" "}
          <a href="#" className="underline hover:text-gray-600">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
} 