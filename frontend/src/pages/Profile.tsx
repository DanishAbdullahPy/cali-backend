import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout, setUser } from '../store/slices/authSlice';
import { updateUser } from '../store/slices/usersSlice';
import { RootState, AppDispatch } from '../store';
import { getImageUrl } from '../utils/env';


const Profile: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

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

  const handleUpload = async () => {
    if (image && user) {
      const formData = new FormData();
      formData.append('avatar', image);
      try {
        const updatedUser = await dispatch(updateUser({ id: user.id, userData: formData })).unwrap();
        dispatch(setUser(updatedUser));
        setPreview(null);
        setImage(null);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="container profile-container">
      <h2>Profile</h2>
      {user ? (
        <div className="profile-card">
          <div className="profile-avatar">
            <img src={preview || getImageUrl(user.avatar) || '/placeholder-avatar.png'} alt="Avatar" />
          </div>
          <div className="profile-info">
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
          </div>
          <div className="profile-actions">
            <h3>Edit Avatar</h3>
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
            {image && (
              <button onClick={handleUpload} disabled={!image}>Upload Image</button>
            )}
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      ) : (
        <p>Please login to view profile</p>
      )}
    </div>
  );
};

export default Profile;
