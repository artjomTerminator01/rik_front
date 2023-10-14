import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import CompanySearch from "../CompanySearch";

function CreateCompany() {
  const [formData, setFormData] = useState({
    name: "",
    regCode: "",
    createdAt: "2001-05-20",
    capital: "",
    members: [],
  });

  const [people, setPeople] = useState([]);
  const [personSearchTerm, setPersonSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const [searchResults, setSearchResults] = useState(people);

  const [member, setMember] = useState();
  const [memberType, setMemberType] = useState("person");
  const [capital, setCapital] = useState("");
  const [role, setRole] = useState("founder");

  const modalRef = useRef();

  useEffect(() => {
    closeModal();
    const api = axios.create({
      baseURL: "http://127.0.0.1:8000",
    });
    api
      .get("/people")
      .then((response) => {
        setPeople(response.data);
        setSearchResults(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleSearch = (event) => {
    const query = event.target.value;
    setPersonSearchTerm(query);

    const filteredResults = people.filter(
      (person) =>
        person.name.toLowerCase().includes(query.toLowerCase()) ||
        person.personal_code.includes(query)
    );

    setSearchResults(filteredResults);
  };

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
      await axios.post("http://127.0.0.1:8000/company", formData);
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

  const handlePersonClick = (person) => {
    setMember(person);
    console.log(person);
    setMemberType("person");
    openModal();
  };

  const handleCompanyClick = (company) => {
    setMember(company);
    setMemberType("company");
    openModal();
  };

  const openModal = () => {
    modalRef.current.style.display = "block";
  };

  const closeModal = () => {
    modalRef.current.style.display = "none";
  };

  const handleModalSubmit = () => {
    formData.members.push({
      name: member.name,
      personal_code: member.personal_code,
      role: role,
      capital: capital,
      is_person: memberType === "person",
    });

    console.log(formData.members);
    closeModal();
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
          <label htmlFor="capital">Capital:</label>
          <input
            type="numer"
            min={2500}
            id="capital"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
          />
        </div>

        <p>Members:</p>
        {formData.members.length > 0 && <p>{formData.members.length}</p>}

        <h1>Person List</h1>
        <div>
          <input
            type="text"
            placeholder="Search by name or personal code"
            value={personSearchTerm}
            onChange={handleSearch}
          />
          <ul>
            {searchResults.map((person) => (
              <li key={person.id} onClick={() => handlePersonClick(person)}>
                {person.name} - Personal Code: {person.personal_code}
              </li>
            ))}
          </ul>
        </div>

        <CompanySearch />

        <button type="submit">Create Company</button>
      </form>
      <p>{message}</p>

      <div ref={modalRef}>
        <span className="close" onClick={closeModal}>
          &times;
        </span>
        <h3>Assign Role and Capital</h3>
        {member && <h2>{member.name}</h2>}
        <label>
          Capital:
          <input
            type="number"
            value={capital}
            onChange={(e) => setCapital(e.target.value)}
          />
        </label>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="founder">Founder</option>
            <option value="member">Member</option>
          </select>
        </label>
        <button onClick={handleModalSubmit}>Add Person to Company</button>
      </div>
    </div>
  );
}

export default CreateCompany;
