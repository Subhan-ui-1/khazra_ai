"use client";

import AuthLayout from "@/components/authLayout/AuthLayout";
import FormInput from "@/components/formInput/FormInput";
import Navbar from "@/components/navbar/Navbar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { postRequest } from "@/utils/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loadingScreen, setLoadingScreen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Validation states
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      if (user.boundary) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard?section=add-boundary");
      }
    }
  }, []);
  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Password validation regex (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const validateEmail = (email: string): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    }

    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }

    // Allow both work emails and personal emails
    // No domain restrictions - users can use any valid email domain
    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError("Password is required");
      return false;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
      );
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleEmailChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    checkFormValidity(value, password);
  };

  const handlePasswordChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    checkFormValidity(email, value);
  };

  const checkFormValidity = (emailValue: string, passwordValue: string) => {
    const isEmailValid = validateEmail(emailValue);
    const isPasswordValid = validatePassword(passwordValue);
    setIsFormValid(isEmailValid && isPasswordValid);
  };

  const handleNavigate = (route: string) => {
    // setLoadingScreen(true);
    router.push(route);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingBtn(true);
    // Validate both fields
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      return;
    }
    try {
      const response = await postRequest(
        "auth/login",
        {
          email,
          password,
        },
        "Login successful",
        undefined,
        "post"
      );
      console.log(response);
      if (response.success === true) {
        toast.success(response.message);
        localStorage.setItem("tokens", JSON.stringify(response.tokens));
        localStorage.setItem("user", JSON.stringify(response.user));
        if (response.user.boundary) {
          router.replace("/dashboard");
        } else {
          router.replace("/dashboard?section=add-boundary");
        }
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.log(error.response.message);
      toast.error(error.response.message);
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <>
      <Navbar />
      <AuthLayout
        heading="Welcome Back"
        description="Glad to see you again—let’s continue your sustainability journey."
        imageSrc={"/Login.png"}
        bottomSlot={
          <p
            className="text-center text-[var(--Paragraph)]"
            style={{ fontSize: "var(--P1-size)" }}
          >
            By writing Email above, you acknowledge that you have read and
            understood, and agree to Khazra.ai{" "}
            <a href="/terms" className="text-[var(--Primary)] cursor-pointer">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-[var(--Primary)] cursor-pointer">
              Privacy Policy
            </a>
          </p>
        }
      >
        {/* Google Login */}
        {/* <button
                    className="w-full flex items-center justify-center border border-[var(--Outline)] rounded-lg py-3 mb-4 gap-2 cursor-pointer"
                    style={{
                        backgroundColor: 'var(--Placeholder)',
                        fontSize: 'var(--P1-size)',
                        fontWeight: 'var(--P1-weight)',
                    }}
                >
                    <Image src="/google.svg" alt="Google" width={32} height={32} className="md:w-[24px] h-auto w-[20px]" />
                    Continue with Google
                </button> */}

        {/* Divider */}
        {/* <div className="flex items-center mb-4">
                    <hr className="flex-grow border-gray-300" />
                    <span className="px-2 text-sm text-gray-400">or</span>
                    <hr className="flex-grow border-gray-300" />
                </div> */}

        {/* Form */}
        <form className="max-w-[500px] w-full mx-auto" onSubmit={handleLogin}>
          {/* Email */}
          <div className="mb-4">
            <FormInput
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email address"
              required
              value={email}
              onChange={handleEmailChange}
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {emailError}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <FormInput
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="Your password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 bottom-3 text-gray-500 cursor-pointer"
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
            {passwordError && (
              <p className="text-red-500 text-sm mt-1 flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                {passwordError}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex justify-between items-center mb-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" className="accent-black" />
              Remember me
            </label>
            <button
              type="button"
              onClick={() => handleNavigate("/forgetPassword")}
              className="text-[#0D5942] font-medium cursor-pointer"
              style={{ fontSize: "var(--P2-size)" }}
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={!isFormValid || loadingBtn}
            className={`w-full text-[20px] p-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              isFormValid && !loadingBtn
                ? "bg-black hover:opacity-90 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed opacity-50"
            }`}
            style={{ color: "var(--Placeholder)" }}
          >
            {loadingBtn ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </>
            ) : isFormValid ? (
              "Login"
            ) : (
              "Please fill all fields correctly"
            )}
          </button>

          {/* Signup redirect */}
          <p
            className="text-center mt-3"
            style={{ fontSize: "var(--P2-size)", color: "var(--Paragraph)" }}
          >
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => handleNavigate("/signup")}
              className="text-[#0D5942] cursor-pointer"
            >
              Sign up
            </button>
          </p>
        </form>
      </AuthLayout>

      {loadingScreen && (
        <div className="fixed inset-0 z-[999] backdrop-blur-sm bg-black/40 flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/3285712b-b88e-4d25-b560-0792e2ac5457/ciHZUebQPG.lottie"
            autoplay
            loop
            style={{ width: 150, height: 150 }}
          />
        </div>
      )}
    </>
  );
}
