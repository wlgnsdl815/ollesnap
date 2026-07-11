import { redirect } from "next/navigation";

import { createClient } from "@/shared/supabase/server";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/");
  }

  return (
    <div className="mx-auto flex min-h-full w-full max-w-md flex-col justify-center gap-10 px-6 py-12 sm:max-w-2xl lg:max-w-4xl">
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-3xl font-black tracking-normal text-primary">
          ollesnap
        </span>
        <p className="text-sm text-muted-foreground">
          로그인하고 제주 스냅 일정을 만들어보세요
        </p>
      </div>

      <LoginForm />
    </div>
  );
}
