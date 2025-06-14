import React from "react";

interface LoginLoadProps {
  message: string;
}

const LoginLoad: React.FC<LoginLoadProps> = ({ message }) => {
  return <div>{message}</div>;
};

export default LoginLoad;