import './App.css';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const body = isLogin 
        ? { email, password }
        : { email, password, name };

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body) 
      });

      const data = await response.json();
      
      if (response.ok) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        
        setMessage('Success!');
        setEmail('');
        setName(''); 
        setPassword('');
      } else {
        setMessage(data.error || 'An error occurred');
      }
    } catch (error) {
      setMessage('Failed to connect to server');
      console.error('Error:', error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <label htmlFor="name">Name:</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="Enter your Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          
          <input type="submit" value={isLogin ? 'Login' : 'Register'} />
          
          {message && <p>{message}</p>}
        </form>
        
        <button 
          onClick={() => setIsLogin(!isLogin)}
          type="button"
        >
          {isLogin ? 'Switch to Register' : 'Switch to Login'}
        </button>
        <Link to='/Main' className="nav-link">
          <button className="app-button" type="button">
            Home    
          </button>
        </Link>
      </header>
    </div>
  );
}