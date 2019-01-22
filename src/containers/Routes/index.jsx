import React from 'react';
import { Router, Route, Switch } from 'react-router-dom';

import Auth from '../../auth';
import history from '../../auth/history';

import Home from '../Home';
import Loading from '../Loading';

import Navbar from '../../components/Navbar';

const auth = new Auth();

const handleAuthentication = nextState => {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication();
  }
};

const Routes = () => (
  <Router history={history}>
    <Switch>
      <Route
        path="/callback"
        render={props => {
          handleAuthentication(props);
          return <Loading {...props} />;
        }}
      />
      <Navbar auth={auth} />
      <Route exact path="/" render={props => <Home auth={auth} {...props} />} />
      <Route render={() => <p>Not Found</p>} />
    </Switch>
  </Router>
);

export default Routes;
