'use client';

import Layout from "../../components/sub_pages/Layout";
import ConsultationAdmin from "@/app/pages/admin/ConsultationAdmin";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function EnquiryPage() {
    return (
        <div className="">
            <ProtectedRoute>
            <Layout>
                <ConsultationAdmin/>
            </Layout>
            </ProtectedRoute>
        </div>
    );
}
