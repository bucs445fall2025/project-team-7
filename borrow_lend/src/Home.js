import logo from './logo.svg';
import './App.css';

export default function HomeLink() {
  return (
    <div className="app-container">
      <h1 className="title">Title</h1>
      <img src={logo} alt="App Logo" className="app-logo" />
      <MyButton/>
    </div>
  );
}

function MyButton() {
  function handleClick() {
  }
  return (
    <button className="app-button" onClick={handleClick}>
      Start
    </button>
    
  );
}