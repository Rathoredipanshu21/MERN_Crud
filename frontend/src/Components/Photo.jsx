import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Photo.css';

const Photo = () => {
  const [formData, setFormData] = useState({
    name: '',
    photo: null,
  });

  const [uploadedPhotos, setUploadedPhotos] = useState([]); // To store fetched photos

  // Handle text input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0], // Store the file in state
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data object to send the file and text data
    const uploadData = new FormData();
    uploadData.append('name', formData.name);
    uploadData.append('photo', formData.photo);

    try {
      const response = await axios.post('http://localhost:5000/submit-photo', uploadData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Photo submitted:', response.data);
      alert('Photo uploaded successfully!');
      fetchUploadedPhotos(); // Refresh the photo list after uploading
    } catch (error) {
      console.error('Error uploading photo:', error);
    }
  };

  // Fetch uploaded photos from the server
  const fetchUploadedPhotos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/photos');
      setUploadedPhotos(response.data); // Store photos in state
    } catch (error) {
      console.error('Error fetching photos:', error);
    }
  };

  // Fetch photos when the component mounts
  useEffect(() => {
    fetchUploadedPhotos();
  }, []);

  return (
    <>
      <h1>Photo Upload.............</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          required
          onChange={handleChange}
          value={formData.name}
        />
        <input
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Upload Photo</button>
      </form>

      <h2>Uploaded Photos</h2>
      <div className="photo-gallery">
        {uploadedPhotos.map((photo) => (
          <div key={photo.id} className="photo-item">
            <p>{photo.name}</p>
            <img src={`http://localhost:5000${photo.photo}`} alt={photo.name} />
          </div>
        ))}
      </div>
    </>
  );
};

export default Photo;
