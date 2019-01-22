import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import {
  Menu,
  Dropdown,
  Icon,
  Container,
  Header,
  Image,
} from 'semantic-ui-react';

class Navbar extends React.Component {
  componentWillMount() {
    this.setState({ profile: {} });
    const {
      auth: { userProfile, getProfile, isAuthenticated },
    } = this.props;
    if (isAuthenticated()) {
      if (!userProfile) {
        getProfile((err, profile) => {
          this.setState({ profile });
        });
      } else {
        this.setState({ profile: userProfile });
      }
    }
  }

  render() {
    const {
      auth: { isAuthenticated, logout, login },
    } = this.props;
    const {
      profile: { name, picture },
    } = this.state;

    return (
      <Menu fluid borderless>
        <Container>
          <Menu.Item>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Menu position="right">
            {isAuthenticated() ? (
              <React.Fragment>
                <Dropdown item text="Profile" direction="left">
                  <Dropdown.Menu>
                    <Dropdown.Item>
                      <Link to="/profile">
                        <Header as="h4">
                          <Image
                            circular
                            inline
                            src={picture}
                            size="mini"
                            avatar
                          />
                          <span>{name}</span>
                        </Header>
                        <p>View profile</p>
                      </Link>
                    </Dropdown.Item>
                    <Dropdown.Item onClick={logout}>
                      <Icon name="sign-out" />
                      Logout
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                <Menu.Item>
                  <Link to="/cart">
                    <Icon name="cart" />
                  </Link>
                </Menu.Item>
              </React.Fragment>
            ) : (
              <Menu.Item onClick={login}>
                <Icon name="sign-in" />
                Login
              </Menu.Item>
            )}
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}

Navbar.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default Navbar;
