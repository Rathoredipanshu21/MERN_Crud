import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './form.css';

const Form = () => {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    fname: '',
    date: ''
  });

  const [submittedData, setSubmittedData] = useState([]); // Store fetched form data
  const [isEditing, setIsEditing] = useState(false); // Track if editing a record
  const [editId, setEditId] = useState(null); // Store the ID of the entry being edited

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing) {
      // Update an existing entry
      axios.put(`http://localhost:5000/update-form/${editId}`, formData)
        .then(response => {
          console.log('Data updated successfully:', response.data);
          alert('Form data updated successfully!');
          fetchSubmittedData(); // Fetch updated data
          resetForm(); // Reset form after updating
        })
        .catch(error => {
          console.error('There was an error updating the data!', error);
        });
    } else {
      // Submit a new entry
      axios.post('http://localhost:5000/submit-form', formData)
        .then(response => {
          console.log('Data submitted successfully:', response.data);
          alert('Form data saved successfully!');
          fetchSubmittedData(); // Fetch updated data
          resetForm(); // Reset form after submission
        })
        .catch(error => {
          console.error('There was an error saving the data!', error);
        });
    }
  };

  // Function to reset the form
  const resetForm = () => {
    setFormData({ name: '', gender: '', fname: '', date: '' });
    setIsEditing(false);
    setEditId(null);
  };

  // Function to fetch submitted form data from the backend
  const fetchSubmittedData = () => {
    axios.get('http://localhost:5000/form-data')
      .then(response => {
        setSubmittedData(response.data); // Store fetched data in state
      })
      .catch(error => {
        console.error('Error fetching form data:', error);
      });
  };

  // Handle deleting a record
  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/delete-form/${id}`)
      .then(response => {
        console.log('Record deleted successfully:', response.data);
        alert('Record deleted successfully!');
        fetchSubmittedData(); // Refresh data after deletion
      })
      .catch(error => {
        console.error('Error deleting record:', error);
      });
  };

  // Handle editing a record (prefill the form with selected row data)
  const handleEdit = (data) => {
    setFormData({
      name: data.name,
      gender: data.gender,
      fname: data.father_name,
      date: data.dob
    });
    setEditId(data.id);
    setIsEditing(true);
  };

  // Fetch form data when the component mounts
  useEffect(() => {
    fetchSubmittedData();
  }, []);

  return (
    <>
      <h1>Form Inserting.............</h1>
      <form className="form-container" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          required
          onChange={handleChange}
          value={formData.name}
        />
        <select name="gender" onChange={handleChange} value={formData.gender}>
          <option value="" disabled>Select Your Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
        <input
          type="text"
          name="fname"
          placeholder="Enter your Father's name"
          required
          onChange={handleChange}
          value={formData.fname}
        />
        <input
          type="date"
          name="date"
          required
          onChange={handleChange}
          value={formData.date}
        />
        <button type="submit">{isEditing ? 'Update' : 'Submit'}</button>
        {isEditing && <button type="button" onClick={resetForm}>Cancel Edit</button>}
      </form>

      <h2>Submitted Form Data</h2>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Father's Name</th>
              <th>Date of Birth</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {submittedData.length > 0 ? (
              submittedData.map((data, index) => (
                <tr key={index}>
                  <td>{data.name}</td>
                  <td>{data.gender}</td>
                  <td>{data.father_name}</td>
                  <td>{data.dob}</td>
                  <td>
                    <button onClick={() => handleEdit(data)} style={{background:'red',margin:'10px'}}>Edit</button>
                    <button onClick={() => handleDelete(data.id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Form;
