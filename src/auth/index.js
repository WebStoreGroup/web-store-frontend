import auth0 from 'auth0-js';
import history from './history';

const AUTH0_DOMAIN = 'web-store-manager.au.auth0.com'; // TODO: move to .env
const CLIENT_ID = 'bk-B62caaRwTecUBbnSZpL-9hNW959i8'; // TODO: move to .env
const CALLBACK_URL = 'http://localhost:3000/callback';

export default class Auth {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      domain: AUTH0_DOMAIN,
      clientID: CLIENT_ID,
      redirectUri: CALLBACK_URL,
      responseType: 'token id_token',
      audience: 'https://store/api/',
      scope: 'openid profile',
    });

    // bindings, consider to change to class properties arrow function syntax,
    // probably need to configure babel and eslint to support the syntax

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
    this.getAccessToken = this.getAccessToken.bind(this);
    this.getExpiryDate = this.getExpiryDate.bind(this);
    this.getIdToken = this.getIdToken.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.renewSession = this.renewSession.bind(this);
    this.scheduleRenewal = this.scheduleRenewal.bind(this);
    this.setSession = this.setSession.bind(this);

    this.scheduleRenewal();
  }

  getAccessToken() {
    return this.accessToken;
  }

  getIdToken() {
    return this.idToken;
  }

  getProfile(cb) {
    this.auth0.client.userInfo(this.accessToken, (err, profile) => {
      if (profile) {
        this.userProfile = profile;
      }
      cb(err, profile);
    });
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        history.replace('/');
        console.error(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    return new Date().getTime() < this.expiresAt;
  }

  login() {
    this.auth0.authorize();
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null;
    this.idToken = null;
    this.expiresAt = 0;
    this.userProfile = null;

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn');
    clearTimeout(this.tokenRenewalTimeout);

    // navigate to the home route
    history.replace('/');
  }

  renewSession() {
    this.auth0.checkSession({}, (err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
      } else if (err) {
        this.logout();
        console.log(err);
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`,
        );
      }
    });
  }

  setSession(authResult) {
    // Set isLoggedIn flag in localStorage
    localStorage.setItem('isLoggedIn', 'true');

    // Set the time that the access token will expire at
    const expiresAt = authResult.expiresIn * 1000 + new Date().getTime();
    this.accessToken = authResult.accessToken;
    this.idToken = authResult.idToken;
    this.expiresAt = expiresAt;

    this.scheduleRenewal();
    // navigate to the home route
    history.replace('/');
  }

  scheduleRenewal() {
    const timeout = this.expiresAt - Date.now();
    if (timeout > 0) {
      this.tokenRenewalTimeout = setTimeout(() => {
        this.renewSession();
      }, timeout);
    }
  }

  getExpiryDate() {
    return JSON.stringify(new Date(this.expiresAt));
  }
}
