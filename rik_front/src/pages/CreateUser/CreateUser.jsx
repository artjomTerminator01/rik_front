import React, { useState } from "react";
import axios from "axios";

function CreateUser() {
  const [formData, setFormData] = useState({
    name: "",
    personalCode: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://127.0.0.1:8000/person", formData);
      setMessage("Person created successfully.");
      setFormData({
        name: "",
        personalCode: "",
      });
    } catch (error) {
      setMessage("Error creating the person.");
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Create New Company</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="personalCode">Personal Code:</label>
          <input
            type="text"
            id="personalCode"
            name="personalCode"
            value={formData.personalCode}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Create Person</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateUser;
