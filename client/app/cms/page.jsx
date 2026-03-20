"use client";
import Layout from "../components/sub_pages/Layout";
import BlogDashboard from "@/app/pages/admin/BlogDashboard";
import ProtectedRoute from "@/app/components/ProtectedRoute";


export default function CMSHome() {
    return  (
        <ProtectedRoute>
            <Layout>
                <BlogDashboard/>
            </Layout>
        </ProtectedRoute>
    );
}