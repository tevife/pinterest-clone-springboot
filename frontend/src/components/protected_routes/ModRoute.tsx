import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

interface ModRouteProps {
  children: React.ReactNode;
}

const ModRoute: React.FC<ModRouteProps> = ({ children }) => {
  return useAuth().isModerator() ? children : <Navigate to="/" replace={true} />;
};

export default ModRoute;