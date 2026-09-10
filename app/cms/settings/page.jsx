// app/admin/settings/zoho-mail/page.jsx
"use client";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Label } from "@/app/components/ui/label";
import { useZohoMail } from "@/app/context/ZohoMailContext";
import React, { useState, useEffect } from "react";
import {
  Mail,
  Settings,
  Send,
  RefreshCw,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Layout from "@/app/components/sub_pages/Layout";
import { toast } from "@/app/components/ui/use-toast";

export default function ZohoMailSettings() {
  const {
    settings,
    loading,
    fetchSettings,
    updateSettings,
    testMail,
    isTesting,
  } = useZohoMail();
  const [toMailAddress, setToMailAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  useEffect(() => {
    if (settings) {
      setToMailAddress(settings.toMailAddress || "");
    }
  }, [settings]);

  const handleSave = async () => {
    if (!toMailAddress) {
      toast({
        title: "Error",
        description: "Please enter a recipient email address",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings({
        toMailAddress: toMailAddress,
        customData: settings?.customData || {},
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTest = async () => {
    if (!toMailAddress) {
      toast({
        title: "Error",
        description: "Please save settings before testing",
        variant: "destructive",
      });
      return;
    }
    await testMail(toMailAddress);
  };

  return (
    <Layout>
      <div className="container-wide py-8 ">
        <div className="mb-8">
          <h1 className="text-3xl text-black font-bold tracking-tight">
            Mail Settings
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Settings Card */}
          <div className="lg:col-span-2 text-black">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Settings className="w-5 h-5" />
                  Mail Configuration
                </CardTitle>
                <CardDescription>
                  Configure the email recipient and settings for Zoho Mail
                  integration
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Recipient Email */}
                <div className="space-y-2 text-black">
                  <Label htmlFor="toMailAddress">
                    Recipient Email Address{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="toMailAddress"
                    type="email"
                    placeholder="admin@example.com"
                    value={toMailAddress}
                    onChange={(e) => setToMailAddress(e.target.value)}
                    disabled={loading}
                  />
                  <p className="text-sm text-muted-foreground">
                    All consultation emails will be sent to this address
                  </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                  {settings?.toMailAddress ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Configured: {settings.toMailAddress}
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-700 dark:text-red-300">
                        Not configured yet
                      </span>
                    </>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={loading || isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Save Settings
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleTest}
                    disabled={isTesting || !settings?.toMailAddress}
                  >
                    {isTesting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Test Email
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Badge component (if not imported from ui)
const Badge = ({ children, variant }) => {
  const className =
    variant === "destructive"
      ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300"
      : "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {children}
    </span>
  );
};
