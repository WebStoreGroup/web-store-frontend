import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Profile extends Component {
  componentWillMount() {
    this.setState({ profile: {} });
    const {
      auth: { userProfile, getProfile },
    } = this.props;
    if (!userProfile) {
      getProfile((err, profile) => {
        this.setState({ profile });
      });
    } else {
      this.setState({ profile: userProfile });
    }
  }

  render() {
    const { profile } = this.state;
    console.log('profile:', profile);
    return (
      <div>
        <h1>
          {profile.name} || {profile.nickname}
        </h1>
        <img src={profile.picture} alt="profile" />
        <pre>{JSON.stringify(profile, null, 2)}</pre>
      </div>
    );
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default Profile;
