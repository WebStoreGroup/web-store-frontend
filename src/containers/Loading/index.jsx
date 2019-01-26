import React from 'react';
import PropTypes from 'prop-types';

class Loading extends React.Component {
  componentDidMount() {
    const { auth, nextState } = this.props;
    if (/access_token|id_token|error/.test(nextState.location.hash)) {
      auth.handleAuthentication();
    }
  }

  render() {
    return <p>Loading.......................</p>;
  }
}

Loading.propTypes = {
  auth: PropTypes.object.isRequired,
  nextState: PropTypes.object.isRequired,
};

export default Loading;
