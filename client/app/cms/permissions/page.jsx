import Permissions from "../../pages/admin/Permissions";
import Layout from "../../components/sub_pages/Layout";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute>
        <Layout>
            <Permissions />
        </Layout>
        </ProtectedRoute>
    );
}
