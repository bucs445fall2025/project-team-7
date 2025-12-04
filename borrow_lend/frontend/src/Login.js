import './App.css';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  // Check if register parameter is in URL
  useEffect(() => {
    if (searchParams.get('register') === 'true') {
      setIsLogin(false);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = isLogin ? '/login' : '/register';
      const body = isLogin 
        ? { email, password }
        : { email, password, name };

      const response = await fetch(`${API_URL}/api/auth${endpoint}`, {
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
        
        setMessage('Success! Redirecting...');
        setEmail('');
        setName(''); 
        setPassword('');
        setTimeout(() => {
          navigate('/main');
        }, 1000);
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
        <Link to='/' className="nav-link">
          <button className="app-button" type="button">
            Back to Home    
          </button>
        </Link>
      </header>
    </div>
  );
}