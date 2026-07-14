"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useState } from "react";

import { Input } from "@/shared/components/ui/input";
import { createClient } from "@/shared/supabase/client";

type AuthMode = "login" | "signup";

interface LoginFormProps {
  nextPath: string;
}

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  async function handleOAuthLogin(provider: "google" | "kakao") {
    setErrorMessage(null);
    const supabase = createClient();
    const callbackUrl = new URL("/auth/callback", window.location.origin);

    callbackUrl.searchParams.set("next", nextPath);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: callbackUrl.toString() },
    });

    if (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);
    setIsSubmitting(true);

    const supabase = createClient();

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      setIsSubmitting(false);

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push(nextPath);
      router.refresh();
      return;
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (data.session) {
      router.push(nextPath);
      router.refresh();
      return;
    }

    setInfoMessage("가입 확인 이메일을 보냈어요. 메일함을 확인해주세요.");
  }

  function toggleMode() {
    setMode((current) => (current === "login" ? "signup" : "login"));
    setErrorMessage(null);
    setInfoMessage(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin("google")}
          className="flex min-h-12 items-center justify-center gap-3 rounded-2xl border border-border bg-card text-sm font-bold text-foreground shadow-sm active:bg-muted"
        >
          <GoogleIcon className="size-5" />
          구글로 계속하기
        </button>
        <button
          type="button"
          onClick={() => handleOAuthLogin("kakao")}
          className="flex min-h-12 items-center justify-center gap-3 rounded-2xl bg-[#FEE500] text-sm font-bold text-black active:bg-[#FEE500]/80"
        >
          <KakaoIcon className="size-5" />
          카카오로 계속하기
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-border" />
        <span className="text-xs font-medium text-muted-foreground">또는</span>
        <span className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
        <Input
          type="email"
          required
          placeholder="이메일"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="min-h-12 rounded-2xl px-4"
        />
        <Input
          type="password"
          required
          minLength={6}
          placeholder="비밀번호"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="min-h-12 rounded-2xl px-4"
        />

        {errorMessage && (
          <p className="text-xs font-medium text-destructive">
            {errorMessage}
          </p>
        )}
        {infoMessage && (
          <p className="text-xs font-medium text-primary">{infoMessage}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex min-h-12 items-center justify-center rounded-2xl bg-primary text-sm font-black text-primary-foreground active:bg-primary/90 disabled:opacity-50"
        >
          {mode === "login" ? "이메일로 로그인" : "이메일로 회원가입"}
        </button>
      </form>

      <button
        type="button"
        onClick={toggleMode}
        className="min-h-11 text-center text-xs font-semibold text-muted-foreground"
      >
        {mode === "login"
          ? "계정이 없으신가요? 회원가입"
          : "이미 계정이 있으신가요? 로그인"}
      </button>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        fill="#000000"
        d="M12 3.5c-5.523 0-10 3.463-10 7.735 0 2.708 1.822 5.086 4.573 6.43-.2.75-.72 2.695-.826 3.113-.132.517.19.51.4.371.164-.108 2.61-1.77 3.67-2.49.703.104 1.432.16 2.183.16 5.523 0 10-3.463 10-7.584S17.523 3.5 12 3.5z"
      />
    </svg>
  );
}
