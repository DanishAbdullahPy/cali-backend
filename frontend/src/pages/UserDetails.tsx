import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserById } from '../store/slices/usersSlice';
import { RootState, AppDispatch } from '../store';
import { getImageUrl } from '../utils/env';

// Removed API_BASE_URL constant - using getImageUrl utility instead

const UserDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading, error } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;
  if (!currentUser) return <div className="container">User not found</div>;

  return (
    <div className="container user-details-container">
      <h2>User Details</h2>
      <div className="user-details-card">
        <img src={getImageUrl(currentUser.avatar) || '/placeholder-avatar.png'} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
        <div className="user-details-info">
            <p><strong>Name:</strong> {currentUser.firstName} {currentUser.lastName}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
        </div>
      </div>
      <div className="user-details-actions">
        <button onClick={() => navigate(`/users/${id}/edit`)}>Edit</button>
        <button onClick={() => navigate('/users')}>Back to Users</button>
      </div>
    </div>
  );
};

export default UserDetails;
