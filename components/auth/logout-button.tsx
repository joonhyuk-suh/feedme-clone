"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = Pick<React.ComponentProps<typeof Button>, "variant" | "size"> & {
  /** Where to go after signing out. `null` stays on the current page. */
  redirectTo?: string | null;
};

export function LogoutButton({
  redirectTo = "/auth/login",
  variant = "outline",
  size,
}: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (redirectTo) router.replace(redirectTo);
    router.refresh();
  };

  return (
    <Button variant={variant} size={size} onClick={logout}>
      로그아웃
    </Button>
  );
}
