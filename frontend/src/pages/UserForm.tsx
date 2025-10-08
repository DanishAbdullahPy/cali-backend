import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createUser, updateUser, fetchUserById } from '../store/slices/usersSlice';
import { RootState, AppDispatch } from '../store';
import { getImageUrl } from '../utils/env';

interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  [key: string]: string | File;
}

const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const { currentUser, loading } = useSelector((state: RootState) => state.users);
  const [formData, setFormData] = useState<UserFormData>({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && currentUser) {
      setFormData({
        email: currentUser.email || '',
        firstName: currentUser.firstName || '',
        lastName: currentUser.lastName || '',
        password: '',
      });
    }
  }, [currentUser, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Check if MediaDevices API is supported
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        // Create a video element to capture the stream
        const video = document.createElement('video');
        video.style.display = 'none';
        document.body.appendChild(video);
        
        // Get the camera stream
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        
        // Set the video source and play
        video.srcObject = stream;
        video.play();
        
        // Wait for the video to start playing
        await new Promise(resolve => {
          video.onloadedmetadata = resolve;
        });
        
        // Create a canvas to capture the image
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
        
        // Draw the video frame to the canvas
        context?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert the canvas to a blob
        canvas.toBlob((blob) => {
          if (blob) {
            // Create a file from the blob
            const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
            setImage(file);
            
            // Create a preview
            const reader = new FileReader();
            reader.onloadend = () => {
              setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
          }
          
          // Clean up
          stream.getTracks().forEach(track => track.stop());
          document.body.removeChild(video);
        }, 'image/jpeg');
      } else {
        // Fallback to file input if MediaDevices API is not supported
        document.getElementById('camera-input')?.click();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      // Fallback to file input if there's an error
      document.getElementById('camera-input')?.click();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let userData: FormData | UserFormData;
      
      if (image) {
        const formDataObj = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          if (key !== 'password' || value) {
            formDataObj.append(key, value);
          }
        });
        formDataObj.append('avatar', image);
        userData = formDataObj;
      } else {
        userData = formData;
      }
      
      if (id) {
        await dispatch(updateUser({ id, userData }));
        navigate('/users');
      } else {
        await dispatch(createUser(userData));
        alert('Account created successfully! Please login to continue.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  if (loading && id) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>{id ? 'Edit User' : 'Create User'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input id="firstName" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input id="lastName" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
        </div>
        {!id && (
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
          </div>
        )}
        <div className="form-group">
          <label htmlFor="avatar">Profile Picture</label>
          <div className="image-source-options">
            <button 
              type="button" 
              onClick={() => document.getElementById('gallery-input')?.click()}
              className="image-source-btn"
            >
              Choose from Gallery
            </button>
            <button 
              type="button" 
              onClick={handleCameraCapture}
              className="image-source-btn"
            >
              Take Photo
            </button>
          </div>
          <input 
            id="gallery-input"
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
            style={{display: 'none'}}
          />
          <input 
            id="camera-input"
            type="file" 
            accept="image/*" 
            capture="user"
            onChange={handleImageChange} 
            style={{display: 'none'}}
          />
          {(preview || (id && currentUser?.avatar)) && (
            <img
              src={preview || getImageUrl(currentUser?.avatar) || '/placeholder-avatar.png'}
              alt="Profile preview"
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                marginTop: '10px'
              }}
            />
          )}
        </div>
        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={() => navigate('/users')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UserForm;
