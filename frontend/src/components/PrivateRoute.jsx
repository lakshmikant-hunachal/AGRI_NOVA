import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, adminOnly = false }) => {
  const userJson = localStorage.getItem('user');

  if (!userJson) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userJson);

  // If route is admin-only, verify email
  if (adminOnly && user.email !== 'admin@smartcrop.com') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute;
