import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Component
class App extends Component {
  render() {
    return <Hello />;
  }
}
// Stateless Functional Component
function Hello() {
  return <div>Hello React!!!</div>;
}

// initialize
ReactDOM.render(<App/>, document.getElementById('app'));

