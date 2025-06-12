import React from 'react';

import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import type { RootState } from '../../redux/stroe';



interface ProtectedRouteProps {
  element: React.ReactNode;
}

export default function ProtectedRoute({ element }: ProtectedRouteProps): React.ReactNode {
  const isUserLoggedin = useSelector((state:RootState ) => !!state.auth.userToken);
  const isOrganiserLoggedin = useSelector((state: RootState) => !!state.auth.organiserToken);
 

  return (isUserLoggedin || isOrganiserLoggedin) ? element : <Navigate to="/login" />;
}
