import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, deleteUser, fetchAndStoreUsers } from '../store/slices/usersSlice';
import { RootState, AppDispatch } from '../store';
import { User } from '../types/index';
import { getImageUrl } from '../utils/env';

// Using getImageUrl utility instead of hardcoded API_BASE_URL

const Users: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, fetchLoading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
  };

  if (loading) return <div className="container">Loading...</div>;
  if (error) return <div className="container">Error: {error}</div>;

  return (
    <div className="container">
      <div className="users-header">
        <h2>Users</h2>
        <div>
          <button onClick={() => navigate('/users/new')}>Add User</button>
          <button onClick={() => {
            dispatch(fetchAndStoreUsers()).then(() => {
              dispatch(fetchUsers());
            });
          }} disabled={fetchLoading}>
            {fetchLoading ? 'Fetching...' : 'Fetch Users'}
          </button>
        </div>
      </div>
      <ul className="users-list">
        {users.map((user: User) => (
          <li key={user.id}>
            <img src={getImageUrl(user.avatar) || '/placeholder-avatar.png'} alt={`${user.firstName} ${user.lastName}`} />
            <div className="user-info">
              <span>{user.firstName} {user.lastName}</span>
              <span>{user.email}</span>
            </div>
            <div className="user-actions">
              <button onClick={() => navigate(`/users/${user.id}`)}>View</button>
              <button onClick={() => navigate(`/users/${user.id}/edit`)}>Edit</button>
              <button onClick={() => handleDelete(user.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
