import React from 'react';

class App extends React.Component {
  joinLobby() {
    console.log('joining lobby...');
    fetch('/join-lobby', {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
    });
  }

  render() {
    return (
      <div className="container my-5">
        <h1>It's an app or whatever</h1>
        <p>It could be a tic tac toe game if I felt like it.</p>
        <button
          type="button"
          className="btn btn-primary btn-lg"
          onClick={ this.joinLobby }
        >
          Join Lobby
        </button>
      </div>
    );
  }
}

export default App;
