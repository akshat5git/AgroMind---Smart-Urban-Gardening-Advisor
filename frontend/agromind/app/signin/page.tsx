"use client";

import { signIn } from "next-auth/react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ReCAPTCHA from "react-google-recaptcha";

export default function Login() {
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const captchaRef = useRef<ReCAPTCHA | null>(null);

  // ✅ Pure validation functions (NO state updates)
  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password: string) => {
    return password.length >= 6;
  };

  // ✅ Derived state (no useState needed)
  const isDisabled =
    !isValidEmail(email) ||
    !isValidPassword(password) ||
    loading;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const token = captchaRef.current?.getValue();

    if (!token) {
      setError("Please verify CAPTCHA");
      return;
    }

    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      token,
      redirect: false,
    });

    setLoading(false);
    captchaRef.current?.reset();

    if (result?.ok) {
      router.push("/dashboard");
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-3 sm:px-4 py-4 sm:py-8">
      <Card className="w-full max-w-md sm:max-w-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="size-16 bg-green-600 rounded-full flex items-center justify-center">
              <Sprout className="size-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl">Welcome to AgroMind</CardTitle>
          <CardDescription>
            Your intelligent urban gardening assistant
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-4 md:space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base"
              />
              {email && !isValidEmail(email) && (
                <p className="text-red-500 text-sm">
                  Invalid email format
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base"
              />
              {password && !isValidPassword(password) && (
                <p className="text-red-500 text-sm">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* CAPTCHA */}
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY!}
              ref={captchaRef}
            />

            {/* Error */}
            {error && (
              <p className="text-red-500 text-sm">{error + "#3"}</p>
            )}

            {/* Button */}
            <Button
              disabled={isDisabled}
              type="submit"
              className="w-full disabled:bg-gray-400 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700"
            >
              {loading ? "Please wait..." : "Login"}
            </Button>
          </form>

          {/* Google Login */}
          <button
            onClick={() =>
              signIn("google", { callbackUrl: "/dashboard" })
            }
            className="w-full border my-3 py-2 rounded-md flex items-center justify-center gap-2 hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              width={20}
            />
            Continue with Google
          </button>

          {/* Signup */}
          <p className="text-center mt-4">
            Don't have an account?{" "}
            <button
              onClick={() => router.push("/signup")}
              className="text-green-600 font-medium hover:underline"
            >
              Sign Up
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}