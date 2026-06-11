"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const [email, setEmail] = useState("demo@visapath.ai");
  const [password, setPassword] = useState("password123");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in to VisaPath AI</CardTitle>
          <p className="text-sm text-slate-500">Use your account credentials to access the workspace.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
          <Input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Password" type="password" />
          <Button
            className="w-full"
            onClick={() => signIn("credentials", { email, password, callbackUrl: "/dashboard" })}
          >
            Continue
          </Button>
          <p className="text-xs text-slate-500">
            Create a user through the API <code>/api/auth/register</code> endpoint or seed your environment before using
            credentials.
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
