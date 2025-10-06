import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <form action="/submit_form" method="post"/>
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your Username"/>
        <label for="password">Password:</label>
        <input type="text" id="password" name="password" placeholder="Enter your Password"/>
        <input type="submit"/>
        <form/>
      </header>
    </div>
  );
}

export default App;
