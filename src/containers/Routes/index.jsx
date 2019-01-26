import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Auth from '../../auth';
import history from '../../auth/history';

import Home from '../Home';
import Loading from '../Loading';

import Navbar from '../../components/Navbar';

const auth = new Auth();

const Routes = () => (
  <Router history={history}>
    <div>
      <Navbar auth={auth} />
      <Switch>
        <Route
          exact
          path="/"
          render={props => <Home auth={auth} {...props} />}
        />
        <Route
          path="/callback"
          render={props => <Loading nextState={props} auth={auth} />}
        />
        <Route render={() => <p>Not Found</p>} />
      </Switch>
    </div>
  </Router>
);

export default Routes;
