import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Welcome, Login, Users, UserDetails, UserForm, Profile } from './pages';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/users/new" element={<UserForm />} />
        <Route path="/users" element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path="/users/:id" element={<ProtectedRoute><UserDetails /></ProtectedRoute>} />
        <Route path="/users/:id/edit" element={<ProtectedRoute><UserForm /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
