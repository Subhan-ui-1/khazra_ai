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
import { safeLocalStorage } from "@/utils/localStorage";
import { useI18n } from "@/i18n/context";
import { Loader } from "lucide-react";

export default function LoginPage() {
  const { t } = useI18n();
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
    const userString = safeLocalStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      if (user.boundary) {
        router.push("/dashboard");
      } else {
        router.push("/dashboard?section=boundary-setup");
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
      setEmailError(t('errors.validation'));
      return false;
    }

    if (!emailRegex.test(email)) {
      setEmailError(t('errors.validation'));
      return false;
    }

    setEmailError("");
    return true;
  };

  const validatePassword = (password: string): boolean => {
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
    // validatePassword(value);
    checkFormValidity(email, value);
  };

  const checkFormValidity = (email: string, password: string) => {
    const isValid = validateEmail(email) && validatePassword(password);
    setIsFormValid(isValid);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error(t('errors.validation'));
      return;
    }

    try {
      setLoadingBtn(true);
      const response = await postRequest(
        "auth/login",
        {
          email,
          password,
        },
        "post"
      );

      if (response?.success) {
        safeLocalStorage.setItem('resetToken', response.resetToken)
        toast.success(t('auth.loginSuccess'));
        safeLocalStorage.setItem("tokens", JSON.stringify(response.tokens));
        safeLocalStorage.setItem("user", JSON.stringify(response.user));
        safeLocalStorage.setItem('permissions', JSON.stringify(response.user.role.permissions))
        if(response.user.boundary){
          router.push("/dashboard");
        } else {
          router.push("/welcome");
        }
        // router.push("/dashboard");
      } else {
        toast.error(t('errors.general'));
      }
    } catch (error) {
      toast.error(t('errors.network'));
    } finally {
      setLoadingBtn(false);
    }
  };

  return (
    <div>
      <Navbar />
      <AuthLayout
        heading={t('navigation.login')}
        description={t('auth.resetPasswordInstructions')}
        bottomSlot={null}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput
            name="email"
            label={t('auth.email')}
            type="email"
            placeholder={t('auth.email')}
            value={email}
            onChange={handleEmailChange as any}
          />

          <div className="relative">
            <FormInput
              name="password"
              label={t('auth.password')}
              type={showPassword ? "text" : "password"}
              placeholder={t('auth.password')}
              value={password}
              onChange={handlePasswordChange as any}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-9 text-gray-500"
              aria-label={t('auth.password')}
            >
              {showPassword ? (
                <AiOutlineEyeInvisible size={20} />
              ) : (
                <AiOutlineEye size={20} />
              )}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" className="accent-black" />
              <span>{t('auth.rememberMe')}</span>
            </label>
            <button
              type="button"
              onClick={() => router.push('/forgetPassword')}
              className="text-sm text-[#0D5942] hover:underline"
            >
              {t('navigation.forgotPassword')}
            </button>
          </div>

          <button
            type="submit"
            disabled={loadingBtn}
            className="w-full bg-[#0D5942] h-[40px] text-white py-2 rounded-md hover:bg-[#0A4A37] disabled:opacity-50 transition-colors"
          >
           {loadingBtn?<Loader className="w-4 h-4 animate-spin mx-auto my-auto" />:t('navigation.login')}
          </button>

          <div className="text-center text-sm mt-2" style={{ color: "var(--Paragraph)" }}>
            {t('auth.dontHaveAccount')}
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="ml-2 text-[#0D5942] hover:underline"
            >
              {t('navigation.signup')}
            </button>
          </div>
        </form>
      </AuthLayout>
    </div>
  );
}
