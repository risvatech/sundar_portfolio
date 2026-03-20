'use client';

import Layout from "../../components/sub_pages/Layout";
import BlogDashboard from "../../pages/admin/BlogDashboard";
import ProtectedRoute from "@/app/components/ProtectedRoute";
export default function Blog() {
    return (
            <ProtectedRoute>
            <Layout>
                <BlogDashboard/>
            </Layout>
            </ProtectedRoute>
    );
}
