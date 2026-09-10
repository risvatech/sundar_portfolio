"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Tabs, TabsContent } from "../../components/ui/tabs";
import { useAuth } from "../../context/AuthContext.jsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {validateLoginData} from "@/app/utils/validation";

export default function AuthPage() {
  const { loginMutation, user, loading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push("/cms");
      router.refresh();
    }
  }, [user, loading, router]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Validate using Zod
      const validatedData = validateLoginData(formData);

      // Use the login mutation from AuthContext
      await loginMutation.mutateAsync(formData);
      toast.success("Login successful!");

      // Redirect after successful login
      router.push("/cms");
      router.refresh();
    } catch (error) {
      console.error("Login error:", error);

      // Zod validation error
      if (error.name === "ZodError") {
        toast.error(error.issues?.[0]?.message || "Validation failed");
        return;
      }

      // Handle other errors
      handleLoginError(error);
    }
  };

  const handleLoginError = (error) => {
    console.error("Login error details:", error);

    // Check if it's a network error first
    if (!error.response) {
      toast.error("Network error. Please check your connection.");
      return;
    }

    const status = error.response?.status;
    const data = error.response?.data;

    console.log("Error status:", status);
    console.log("Error data:", data);

    if (status === 401 || status === 403) {
      toast.error("Invalid email or password");
    } else if (status === 404) {
      toast.error("Invalid email or password");
    } else if (status === 429) {
      toast.error("Too many attempts. Please try again later.");
    } else if (status >= 500) {
      toast.error("Server error. Please try again later.");
    } else {
      toast.error(data?.message || "Login failed. Please try again.");
    }
  };

  // Check if mutation is pending
  const isPending = loginMutation?.isPending || isLoading;

  return (
    <div className="from-primary-50 to-primary-100 flex min-h-screen items-center justify-center bg-gradient-to-br via-white">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col items-center justify-center">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-graphite font-bold">
                Welcome
              </CardTitle>
              <CardDescription>Log in to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={handleLogin} className="space-y-4 text-graphite">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="text"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        required
                        placeholder="Enter your email"
                        autoComplete="email"
                        className="focus:ring-primary "
                        disabled={isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        required
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        data-testid="input-login-password"
                        className="focus:ring-primary focus:ring-2"
                        disabled={isPending}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-secondary hover:bg-secondary/80 w-full text-white"
                      disabled={isPending}
                      data-testid="button-login"
                    >
                      {isPending ? (
                        <>
                          <span className="mr-2 inline-block animate-spin">
                            ⏳
                          </span>
                          Logging In...
                        </>
                      ) : (
                        "Log In"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
