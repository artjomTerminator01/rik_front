import React, { useState } from "react";
import axios from "axios";
import CompanySearch from "../CompanySearch";
import { useNavigate } from "react-router-dom";
import AddMemberModal from "../AddMemberModal";

import styles from "./createCompany.module.scss";
import classNames from "classnames";
import PersonSearch from "../PersonSearch";

function CreateCompany() {
  const navigate = useNavigate();
  const formatCurrentDate = () => {
    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const day = currentDate.getDate().toString().padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [formData, setFormData] = useState({
    name: "",
    regCode: "",
    createdAt: formatCurrentDate(),
    capital: 0,
    members: [],
  });

  const [message, setMessage] = useState();
  const [showModal, setShowModal] = useState(false);

  const [member, setMember] = useState();
  const [memberType, setMemberType] = useState("person");
  const [capital, setCapital] = useState(0);
  const [role, setRole] = useState("founder");
  const [modalMessage, setModalMessage] = useState("");

  const checkCapital = () => {
    let totalMembersCapital = 0;
    formData.members.forEach((member) => {
      totalMembersCapital += parseInt(member.capital);
    });

    if (totalMembersCapital !== parseInt(formData.capital)) {
      setMessage("Company capital is not equal to the sum of members capital.");
      return false;
    }

    return true;
  };

  const validate = () => {
    const isAtLeastOneFounderPresent = formData.members.some((member) => {
      return member.role === "founder";
    });

    if (!isAtLeastOneFounderPresent || formData.members.length === 0) {
      setMessage("At least one founder should be selected");
      return false;
    }

    if (formData.name.length < 3 || formData.name.length > 100) {
      setMessage("Invalid name length");
      return false;
    }

    if (formData.capital < 2500) {
      setMessage("Capital should be at least 2500");
      return false;
    }

    if (formData.regCode.length !== 7) {
      setMessage("Registration code should be 7 characters long");
      return false;
    }

    return checkCapital();
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
    if (validate()) {
      try {
        await axios.post("http://127.0.0.1:8000/company", formData);
        setMessage("Company created successfully.");
        navigate(`/company/${formData.regCode}`);
      } catch (error) {
        error.response.data.detail
          ? setMessage(error.response.data.detail)
          : setMessage("Error creating new company");
      }
    }
  };

  const handlePersonClick = (person) => {
    setMember(person);
    setMemberType("person");
    setShowModal(true);
  };

  const handleCompanyClick = (company) => {
    setMember(company);
    setMemberType("company");
    setShowModal(true);
  };

  const handleModalSubmit = () => {
    if (capital >= 1) {
      const newMember = {
        name: member.name,
        id: member.id,
        role: role,
        capital: capital,
        is_person: memberType === "person",
      };

      if (memberType === "person") {
        newMember.personal_code = member.personal_code;
      } else {
        newMember.reg_code = member.reg_code;
      }

      formData.members.push(newMember);
      setRole("founder");
      setCapital(0);
      setModalMessage();
      setShowModal(false);
    } else {
      setModalMessage("Capital should be at least 1");
    }
  };

  const removeMember = (memberToRemove) => {
    const filteredMembers = formData.members.filter((member) =>
      memberToRemove.is_person
        ? member.personal_code !== memberToRemove.personal_code
        : member.reg_code !== memberToRemove.reg_code
    );

    setFormData({ ...formData, members: filteredMembers });
  };

  return (
    <div className="container">
      <h1>Create New Company</h1>
      <div className={classNames("row", styles.card)}>
        <div className="col-4">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            minLength={3}
            maxLength={100}
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="regCode">Registration Code:</label>
          <input
            type="number"
            id="regCode"
            name="regCode"
            value={formData.regCode}
            onChange={handleChange}
          />
          <label htmlFor="capital">Capital:</label>
          <input
            type="number"
            min={2500}
            id="capital"
            name="capital"
            value={formData.capital}
            onChange={handleChange}
          />
        </div>
        <div className="col-8">
          {formData.members.map((member, index) => (
            <div className={styles.member} key={index}>
              <p className={styles.memberName}>{member.name}</p>
              <p>{member.capital + " €"}</p>
              <p>{member.role}</p>
              <p>{member.is_person ? "person" : "company"}</p>
              <img
                className={styles.trash}
                src="/assets/trash.webp"
                height={20}
                onClick={() => removeMember(member)}
                alt={"remove member"}
              />
            </div>
          ))}
        </div>
        {<p className={styles.message}>{message}</p>}
        <button onClick={handleSubmit}>Create Company</button>
      </div>
      <div className={classNames("row", styles.card)}>
        <h1>Add member</h1>
        <div className="col-6">
          <h2>Person</h2>
          <PersonSearch
            handlePersonClick={handlePersonClick}
            members={formData.members}
            membersLength={formData.members.length}
          />
        </div>
        <div className="col-6">
          <h2>Company</h2>
          <CompanySearch
            handleCompanyClick={handleCompanyClick}
            members={formData.members}
            membersLength={formData.members.length}
          />
        </div>
      </div>

      {showModal && (
        <AddMemberModal
          closeModal={() => setShowModal(false)}
          member={member}
          capital={capital}
          setCapital={setCapital}
          setRole={setRole}
          role={role}
          handleModalSubmit={handleModalSubmit}
          modalMessage={modalMessage}
        />
      )}
    </div>
  );
}

export default CreateCompany;
