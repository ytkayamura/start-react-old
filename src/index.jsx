import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';

// Component
class App extends Component {
  render() {
    return <Hello />;
  }
}

// Stateless Functional Component
const Hello = () => {
  const [message, setMessage] = useState();

  const hello = async () => {
    const res = await axios.get('/api/hello');
    console.log(res);
    setMessage(res.data);
  };
  return (
    <div>
      <div>Hello React!!!</div>
      <div>{message}</div>
      <button onClick={hello}>Hello!</button>
    </div>
  );
};

// initialize
ReactDOM.render(<App />, document.getElementById('app'));
