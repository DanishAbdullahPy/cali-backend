import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Welcome to Calibort User Management</h1>
      <div>
        <button onClick={() => navigate('/login')} style={{ margin: '10px' }}>
          Login
        </button>
        <button onClick={() => navigate('/users/new')} style={{ margin: '10px' }}>
          Signup
        </button>
        {isAuthenticated && (
          <button onClick={() => navigate('/profile')} style={{ margin: '10px' }}>
            Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default Welcome;
