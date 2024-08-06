import React from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  let navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('isAuthenticated', 'true');
    navigate('/');
  };

  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Log In</button>
    </div>
  );
}

export default Login;
