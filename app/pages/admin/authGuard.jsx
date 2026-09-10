import React from "react";
import { useNavigate } from "react-router-dom";
import api from "@/app/service/api";

const AuthGuard = ({ children }) => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const checkLogin = async () => {
      try {
        const response = await api.get("/user", { withCredentials: true });
        const user = response.data;

        if (!user?.id) {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    checkLogin();
  }, [navigate]);

  return <>{children}</>;
};

export default AuthGuard;
