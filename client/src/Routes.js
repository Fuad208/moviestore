import React, { lazy, Suspense } from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';

import Loading from './components/Loading';
import { ProtectedRoute, WithLayoutRoute } from './routers';

import { AdminLayout, PublicLayout } from './layouts';

// Admin Pages
const DashboardPage = lazy(() => import('./pages/Admin/Dashboard'));
const MovieList = lazy(() => import('./pages/Admin/MovieList'));
const CinemaList = lazy(() => import('./pages/Admin/CinemaList'));
const ShowtimeList = lazy(() => import('./pages/Admin/ShowtimeList'));
const ReservationList = lazy(() => import('./pages/Admin/ReservationList'));
const User = lazy(() => import('./pages/Admin/User'));
const Account = lazy(() => import('./pages/Admin/Account'));

// Auth Pages
const Register = lazy(() => import('./pages/Public/Register'));
const Login = lazy(() => import('./pages/Public/Login'));

// Public Pages
const HomePage = lazy(() => import('./pages/Public/HomePage'));
const MoviePage = lazy(() => import('./pages/Public/MoviePage'));
const MyDashboard = lazy(() => import('./pages/Public/MyDashboard'));
const MovieCategoryPage = lazy(() => import('./pages/Public/MovieCategoryPage'));
const CinemasPage = lazy(() => import('./pages/Public/CinemasPage'));
const BookingPage = lazy(() => import('./pages/Public/BookingPage'));
const Checkin = lazy(() => import('./pages/Public/Checkin'));

const Routes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Switch>
          {/* Auth */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          

          {/* Public */}
          
          <WithLayoutRoute
            exact
            path="/"
            layout={PublicLayout}
            component={HomePage}
          />
          <WithLayoutRoute
            exact
            path="/mydashboard"
            layout={PublicLayout}
            component={MyDashboard}
          />
          <WithLayoutRoute
            exact
            path="/cinemas"
            layout={PublicLayout}
            component={CinemasPage}
          />
          <WithLayoutRoute
            exact
            path="/movie/category/:category"
            layout={PublicLayout}
            component={MovieCategoryPage}
          />
          <WithLayoutRoute
            exact
            path="/movie/:id"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={MoviePage}
          />
          {/* ✅ Tambahan route langsung ke /booking/:id */}
          <WithLayoutRoute
            exact
            path="/booking/:id"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={BookingPage}
          />
          {/* Tetap biarkan ini jika masih ada halaman lain pakai */}
          <WithLayoutRoute
            exact
            path="/movie/booking/:id"
            layout={PublicLayout}
            layoutProps={{ withFooter: false }}
            component={BookingPage}
          />
          <WithLayoutRoute
            exact
            path="/checkin/:reservationId"
            layout={PublicLayout}
            component={Checkin}
          />

          {/* Admin */}
          <ProtectedRoute
            exact
            path="/admin/dashboard"
            layout={AdminLayout}
            component={DashboardPage}
          />
          <ProtectedRoute
            exact
            path="/admin/users"
            layout={AdminLayout}
            component={User}
          />
          <ProtectedRoute
            exact
            path="/admin/showtimes"
            layout={AdminLayout}
            component={ShowtimeList}
          />
          <ProtectedRoute
            exact
            path="/admin/reservations"
            layout={AdminLayout}
            component={ReservationList}
          />
          <ProtectedRoute
            exact
            path="/admin/cinemas"
            layout={AdminLayout}
            component={CinemaList}
          />
          <ProtectedRoute
            exact
            path="/admin/movies"
            layout={AdminLayout}
            component={MovieList}
          />
          <ProtectedRoute
            exact
            path="/admin/account"
            layout={AdminLayout}
            component={Account}
          />

          {/* 404 fallback */}
          <Route path="*" component={() => '404 NOT FOUND'} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default Routes;
