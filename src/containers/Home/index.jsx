import React from 'react';
import PropTypes from 'prop-types';

import Profile from '../../components/Profile';

// https://auth0.com/docs/quickstart/spa/react/01-login#provide-a-login-control

class Home extends React.Component {
  constructor(props) {
    super(props);

    // bindings
    this.goTo = this.goTo.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.fetchApi = this.fetchApi.bind(this);
  }

  componentDidMount() {
    const {
      auth: { renewSession },
    } = this.props;

    if (localStorage.getItem('isLoggedIn') === 'true') {
      renewSession();
    }
  }

  goTo(route) {
    const { history } = this.props;
    history.replace(`/${route}`);
  }

  login() {
    const { auth } = this.props;
    auth.login();
  }

  logout() {
    const { auth } = this.props;
    auth.logout();
  }

  fetchApi() {
    const {
      auth: { getAccessToken },
    } = this.props;
    const API_URL = 'http://localhost:8000/auth/api';
    const headers = { Authorization: `Bearer ${getAccessToken()}` };
    fetch(`${API_URL}/private`, { headers })
      .then(res => res.json())
      .then(res => console.log('Successful api call: ', res))
      .catch(err => console.error('Error on api call: ', err.message));
  }

  render() {
    const { auth } = this.props;
    const { isAuthenticated } = auth;
    return (
      <div>
        <p>Welcome to the homepage.</p>
        {!isAuthenticated() && (
          <button type="button" onClick={this.login}>
            Login
          </button>
        )}
        {isAuthenticated() && (
          <div>
            <button type="button" onClick={this.fetchApi}>
              Call API
            </button>
            <Profile auth={auth} />
            <button type="button" onClick={this.logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    );
  }
}

Home.propTypes = {
  auth: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default Home;
