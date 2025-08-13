import React from "react";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "../../redux/stroe";

interface ProtectedRouteProps {
  element: React.ReactNode;
}

export default function ProtectedRoute({
  element,
}: ProtectedRouteProps): React.ReactNode {
  //const isUserLoggedin = useSelector((state:RootState ) => !!state.auth.authToken);
  //const isOrganiserLoggedin = useSelector((state: RootState) => !!state.auth.authToken);
  const isLoggedIn = useSelector((state: RootState) => !!state.auth.authToken);

  return isLoggedIn ? element : <Navigate to="/login" />;
}
