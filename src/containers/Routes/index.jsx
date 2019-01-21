import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Auth from '../../auth';
import history from '../../auth/history';

import Home from '../Home';
import Loading from '../Loading';

const auth = new Auth();

const handleAuthentication = nextState => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route exact path="/" render={props => <Home auth={auth} {...props} />} />
      <Route
        path="/callback"
        render={props => {
          handleAuthentication(props);
          return <Loading {...props} />;
        }}
      />
    </Switch>
  </Router>
);

export default Routes;
