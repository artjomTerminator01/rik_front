import React, { useState } from "react";
import axios from "axios";

function CreateCompany() {
  const [formData, setFormData] = useState({
    name: "",
    regCode: "",
    createdAt: "",
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
      const api = axios.create({
        baseURL: "http://127.0.0.1:8000",
      });
      await api.post("/company", {
        name: formData.name,
        reg_code: formData.regCode,
        created_at: formData.createdAt,
      });
      setMessage("Company created successfully.");
      setFormData({
        name: "",
        regCode: "",
        createdAt: "",
      });
    } catch (error) {
      setMessage("Error creating the company.");
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
          <label htmlFor="regCode">Registration Code:</label>
          <input
            type="text"
            id="regCode"
            name="regCode"
            value={formData.regCode}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="createdAt">Created At:</label>
          <input
            type="text"
            id="createdAt"
            name="createdAt"
            value={formData.createdAt}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Company</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default CreateCompany;
