"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setServerError("");

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Hardcoded credentials for development
      const validCredentials = [
        { email: "admin@uganda.gov.ug", password: "admin123" },
        { email: "test@test.com", password: "test123" },
        { email: "user@demo.com", password: "demo123" },
      ];

      const isValidCredential = validCredentials.some(
        cred => cred.email === data.email && cred.password === data.password
      );

      if (isValidCredential) {
        // Store a simple auth flag in localStorage for demo
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userEmail", data.email);
        router.push("/dashboard");
      } else {
        setServerError("Invalid email or password. Try: admin@uganda.gov.ug / admin123");
      }
    } catch (err) {
      setServerError("An unexpected error occurred");
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
            Uganda Lab e-Test Requests
          </h1>
          <p className="text-lg text-gray-600">
            Manage your account
          </p>
        </div>

        {/* Form Container - Apple Style Grouped Inputs */}
        <div className="mb-8">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div className="mb-4">
              <div className="border border-gray-300 rounded-2xl overflow-hidden bg-white">
                <div className="relative">
                  <Label 
                    htmlFor="email" 
                    className="absolute left-4 top-3 text-sm text-gray-500 pointer-events-none"
                  >
                    Email or Phone Number
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
            
            {/* Password Field */}
            <div className="mb-6">
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mb-8">
            <Link
              href="/auth/forgot-password"
              className="text-black hover:text-gray-700 font-medium text-sm"
            >
              Forgot password? →
            </Link>
          </div>

          {/* Footer */}
          <div className="text-center">
            <p className="text-gray-600">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="font-medium text-black hover:text-gray-700 transition-colors"
              >
                Create one now
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Terms */}
      <div className="mt-8 text-center">
        <p className="text-xs text-gray-400">
          By signing in, you agree to our{" "}
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