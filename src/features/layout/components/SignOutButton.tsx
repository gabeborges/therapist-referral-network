"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/Button";

export function SignOutButton(): React.ReactElement {
  return (
    <Button
      variant="text"
      onClick={() => signOut({ callbackUrl: "/" })}
      className="block w-full text-center px-4 py-2"
    >
      Sign out
    </Button>
  );
}
