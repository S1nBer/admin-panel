import React from 'react';
import { Route, Redirect, type RouteProps } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../store';
import AppLayout from './AppLayout/AppLayout';

interface PrivateRouteProps extends RouteProps {
  component: React.ComponentType<RouteProps>;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ component: Component, ...rest }) => {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <AppLayout>
            <Component {...props} />
          </AppLayout>
        ) : (
          <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        )
      }
    />
  );
};

export default PrivateRoute;
