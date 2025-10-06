
import './App.css';
import { Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <form action="/submit_form" method="post">
        <label for="username">Username:</label>
        <input type="text" id="username" name="username" placeholder="Enter your Username"/>
        <label for="password">Password:</label>
        <input type="password" id="password" name="password" placeholder="Enter your Password"/>
        <input type="submit"/>
        <MyButton/>
        </form>
      </header>
    </div>
  );
}


function MyButton() {
  function handleClick() {
  }
  return (
    <Link to='/' className="nav-link">
      <button className="app-button" onClick={handleClick}>
        Home
      </button>
    </Link>
  );
}

export default App;
