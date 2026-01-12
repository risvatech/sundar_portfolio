"use client";
import { useAuth } from "../context/AuthContext";
import AuthPage from "../pages/admin/AuthPage";
import Layout from "../components/sub_pages/Layout";
import BlogDashboard from "@/app/pages/admin/BlogDashboard";


export default function CMSHome() {
    const { user } = useAuth();
    return user ? (
        <Layout>
            <BlogDashboard/>
        </Layout>
    ) : (
        <AuthPage />
    );
}