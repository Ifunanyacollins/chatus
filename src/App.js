import React from "react";
import axios from "axios";
import "./App.css";

class App extends React.Component {
  state = {
    apiKey: null,
    sessionId: null,
    token: null
  };

  handleError = error => {
    if (error) {
      alert(error.message);
    }
  };

  initializeSession = () => {
    const { apiKey, sessionId, token } = this.state;
    let session = window.OT.initSession(apiKey, sessionId);

    // Subscribe to a newly created stream
    session.on("streamCreated", function(event) {
      session.subscribe(
        event.stream,
        "subscriber",
        {
          insertMode: "append",
          width: "100%",
          height: "100%"
        },
        this.handleError
      );
    });
    // Create a publisher
    let publisher = window.OT.initPublisher(
      "publisher",
      {
        insertMode: "append",
        width: "100%",
        height: "100%"
      },
      this.handleError
    );

    // Connect to the session
    session.connect(token, function(error) {
      // If the connection is successful, publish to the session
      if (error) {
        this.handleError(error);
      } else {
        session.publish(publisher, () => {
          this.handleError(error);
        });
      }
    });
  };

  _handleStartCall = () => {
    axios
      .get("http://localhost:5000/chatus-e356d/us-central1/helloWorld", {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      })
      .then(({ data }) => {
        this.setState(
          { apiKey: data.apiKey, sessionId: data.sessionId, token: data.token },
          this.initializeSession
        );
      })
      .catch(error => {
        alert(error);
      });
  };

  render() {
    return (
      <>
        <button onClick={this._handleStartCall}>Start call</button>
        <div id="videos">
          <div id="subscriber">{""}</div>
          <div id="publisher">{""}</div>
        </div>
      </>
    );
  }
}

export default App;
