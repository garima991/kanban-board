import React from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const DemoGuard = ({ children, allowed = true, message = "Demo user does not have access to this action." }) => {
  const user = useSelector((state) => state.auth.user);
  const isDemoUser = user?.email && user.email === import.meta.env.VITE_DEMO_USER_EMAIL;

  if (isDemoUser && !allowed) {
    const handleBlocked = (e) => {
      e?.preventDefault?.();
      e?.stopPropagation?.();
      toast.error(message);
    };

    return (
      <span onClickCapture={handleBlocked} className="inline-block opacity-60 cursor-not-allowed">
        {children}
      </span>
    );
  }

  return children;
};

export default DemoGuard;



