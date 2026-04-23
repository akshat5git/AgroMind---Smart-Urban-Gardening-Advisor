"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

export default function SignupPage() {


  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });


  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ✅ handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const captchaRef = useRef<ReCAPTCHA | null>(null);


  // ✅ disable button logic
  const isDisabled =
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !confirmPassword ||
    formData.password !== confirmPassword ||
    loading;

  // ✅ submit handler
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = captchaRef.current?.getValue();

    if (!token) {
      setError("Please verify CAPTCHA");
      return;
    }

    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          token, // ✅ CORRECT WAY
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      setMessage(data.message || "Signup successful");

      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setConfirmPassword("");

      // ✅ reset captcha
      captchaRef.current?.reset();

      setTimeout(() => {
        router.push("/signin");
      }, 1500);

    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-3 sm:px-4 py-4 sm:py-8">
      <div className="w-full max-w-md sm:max-w-lg bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
          Signup
        </h1>

        <form onSubmit={handleSignup} className="space-y-3 sm:space-y-4 md:space-y-5">
          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Create Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-base outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>


          {/* Inline password mismatch */}
          {formData.password !== confirmPassword && confirmPassword && (
            <p className="text-red-500 text-sm">
              Passwords do not match
            </p>
          )}
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY!}
            ref={captchaRef}
          />
          {/* Button */}
          <button
            type="submit"
            disabled={isDisabled}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full border my-2 py-2 rounded-md flex items-center bg-green-300 justify-center gap-2 hover:bg-green-400"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} />
          Continue with Google
        </button>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <button
            onClick={() => router.push("/signin")}
            className="text-green-600 font-medium hover:underline"
          >
            Sign In
          </button>
        </p>
        {/* Success Message */}
        {message && (
          <p className="mt-4 text-green-600 text-center font-medium">
            {message}
          </p>
        )}

        {/* Error Message */}
        {error && (
          <p className="mt-4 text-red-600 text-center font-medium">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}