"use client";
import { useAuth } from "@/app/context/AuthContext";
import AuthPage from "@/app/pages/admin/AuthPage";
import { motion } from "framer-motion";

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-subtle-gradient">

                <div className="flex flex-col items-center gap-6">

                    {/* Loading Text */}
                    <motion.h2
                        className="text-xl font-semibold text-gradient-primary"
                        initial={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "easeInOut", repeatType: "reverse" }}
                    >
                        Loading Dashboard...
                    </motion.h2>

                    {/* Subtext */}
                    <p className="text-muted-foreground text-sm">
                        Please wait while we prepare your workspace
                    </p>

                </div>
            </div>
        );
    }

    if (!user) return <AuthPage />;

    return children;
}