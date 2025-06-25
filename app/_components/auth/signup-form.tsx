"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Please enter a valid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Please confirm your password"),
  facility_name: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupForm) => {
    setIsLoading(true);
    setServerError("");

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          name: data.name,
          email: data.email || null,
          facility_name: data.facility_name || null,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setServerError(result.error || 'Signup failed');
        return;
      }

      if (result.success) {
        router.push("/dashboard");
      } else {
        setServerError("Signup failed. Please try again.");
      }
    } catch (err) {
      setServerError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

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
            Create your account
          </h1>
          <p className="text-lg text-gray-600">
            Join Uganda Lab e-Test Requests
          </p>
        </div>

        {/* Form Container - Apple Style Grouped Inputs */}
        <div className="mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Name Field */}
            <div className="mb-4">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="name" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder=""
                    className={cn(
                      "h-16 px-4 pt-6 pb-2 border-0 rounded-2xl focus:ring-0 focus:border-0 text-gray-900 text-lg bg-transparent",
                      errors.name && "bg-red-50"
                    )}
                    {...register("name")}
                  />
                </div>
              </div>
              {errors.name && (
                <p className="text-sm text-red-600 mt-2 ml-1">{errors.name.message}</p>
              )}
            </div>

            {/* Username Field */}
            <div className="mb-4">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="username" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder=""
                    className={cn(
                      "h-16 px-4 pt-6 pb-2 border-0 rounded-2xl focus:ring-0 focus:border-0 text-gray-900 text-lg bg-transparent",
                      errors.username && "bg-red-50"
                    )}
                    {...register("username")}
                  />
                </div>
              </div>
              {errors.username && (
                <p className="text-sm text-red-600 mt-2 ml-1">{errors.username.message}</p>
              )}
            </div>
            
            {/* Email Field */}
            <div className="mb-4">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="email" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    Email Address (Optional)
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
              {errors.email && (
                <p className="text-sm text-red-600 mt-2 ml-1">{errors.email.message}</p>
              )}
            </div>

            {/* Facility Name Field */}
            <div className="mb-4">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="facility_name" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    Facility Name (Optional)
                  </Label>
                  <Input
                    id="facility_name"
                    type="text"
                    placeholder=""
                    className="h-16 px-4 pt-6 pb-2 border-0 rounded-2xl focus:ring-0 focus:border-0 text-gray-900 text-lg bg-transparent"
                    {...register("facility_name")}
                  />
                </div>
              </div>
            </div>
            
            {/* Password Field */}
            <div className="mb-4">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="password" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    Password
                  </Label>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder=""
                    className={cn(
                      "h-16 px-4 pt-6 pb-2 pr-12 border-0 rounded-2xl focus:ring-0 focus:border-0 text-gray-900 text-lg bg-transparent",
                      errors.password && "bg-red-50"
                    )}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-sm text-red-600 mt-2 ml-1">{errors.password.message}</p>
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
                    Confirm Password
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
              disabled={isLoading}
              className="w-full h-12 bg-black hover:bg-gray-800 text-white font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 mb-6"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-black hover:text-gray-700 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          By creating an account, you agree to our{" "}
          <a href="#" className="underline hover:text-gray-600">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline hover:text-gray-600">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
} 
