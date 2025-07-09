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
import { useAuth } from "@/lib/auth-context";

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login, isLoading, isAuthenticated } = useAuth();

  const [loginSuccess, setLoginSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    setServerError("");
    setLoginSuccess(false);
    console.log('Login form submitted:', data.username);

    login(data)
      .then(() => {
        console.log('Login successful, should redirect to dashboard');
        setLoginSuccess(true);
      })
      .catch((error: any) => {
        console.log('Login failed:', error.message);
        setLoginSuccess(false);
        setServerError(error.message || "Invalid username or password");
      });
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
            CPHL <br/> Reference Testing
          </h1>
         
        </div>

        {/* Form Container - Apple Style Grouped Inputs */}
        <div className="mb-8">
          <form onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}>
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

            {loginSuccess && (
              <div className="mb-6">
                <p className="text-sm text-green-600 ml-1">Login successful, redirecting to dashboard...</p>
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