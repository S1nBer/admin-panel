import { lazy, Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Spin } from 'antd';
import PrivateRoute from './components/PrivateRoute';

const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage/DashboardPage'));
const PostsPage = lazy(() => import('./pages/PostsPage/PostsPage'));
const AuthorsPage = lazy(() => import('./pages/AuthorsPage/AuthorsPage'));
const TagsPage = lazy(() => import('./pages/TagsPage/TagsPage'));

function App() {
  return (
    <Suspense fallback={<Spin size="large" style={{ margin: '20% auto', display: 'block' }} />}>
      <Switch>
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/dashboard" component={DashboardPage} />
        <PrivateRoute path="/posts" component={PostsPage} />
        <PrivateRoute path="/authors" component={AuthorsPage} />
        <PrivateRoute path="/tags" component={TagsPage} />
        <Redirect from="/" to="/dashboard" exact />
        <Redirect to="/dashboard" />
      </Switch>
    </Suspense>
  );
}

export default App;
