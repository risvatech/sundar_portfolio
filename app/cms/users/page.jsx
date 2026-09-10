import UserManagement from "../../pages/admin/UserManagement";
import Layout from "../../components/sub_pages/Layout";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
        <Layout>
            <UserManagement />
        </Layout>
        </ProtectedRoute>
    );
}
