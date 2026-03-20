import { RoleManagement } from "../../pages/admin/RoleManagement";
import Layout from "../../components/sub_pages/Layout";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
        <Layout>
            <RoleManagement />
        </Layout>
        </ProtectedRoute>
    );
}
