import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./changeMembership.module.scss";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
import PersonSearch from "../PersonSearch";
import CompanySearch from "../CompanySearch";
import AddMemberModal from "../AddMemberModal";

const ChangeMembership = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState();
  const [message, setMessage] = useState();
  const [showModal, setShowModal] = useState(false);
  const [updatingCapital, setUpdatingCapital] = useState("");
  const [member, setMember] = useState();
  const [memberType, setMemberType] = useState("person");
  const [capital, setCapital] = useState(0);
  const [newCapital, setNewCapital] = useState(0);
  const [modalMessage, setModalMessage] = useState("");

  const { companyRegCode } = useParams();

  useEffect(() => {
    const api = axios.create({
      baseURL: "http://127.0.0.1:8000",
    });
    api
      .get(`/company/${companyRegCode}`)
      .then((response) => {
        setCompany(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [companyRegCode]);

  const handleCreateMembership = async (membershipData) => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/company/membership",
        membershipData
      );
      setMessage("Member added successfull.");
    } catch (error) {
      error.response.data.detail
        ? setMessage(error.response.data.detail)
        : setMessage("Error adding member");
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

  const handleModalSubmit = async () => {
    if (capital >= 1) {
      const newMember = {
        company_reg_code: company.reg_code,
        capital: parseInt(capital),
        is_person: memberType === "person",
        role: "member",
        member_person_id: memberType === "person" ? member.id : null,
        member_company_id: memberType !== "person" ? member.id : null,
      };

      await handleCreateMembership(newMember);
      navigate(`/company/${companyRegCode}`);
    } else {
      setModalMessage("Capital should be at least 1");
    }
  };

  const updateMembersCapital = async (membershipId) => {
    if (checkTotalCapital()) {
      try {
        await axios.post("http://127.0.0.1:8000/company/membership/capital", {
          membership_id: membershipId,
          capital: parseInt(newCapital),
        });
        navigate(`/company/${companyRegCode}`);
      } catch (error) {
        error.response.data.detail
          ? setMessage(error.response.data.detail)
          : setMessage("Error updating company");
      }
    }
  };

  const checkTotalCapital = () => {
    let totalCapital = parseInt(newCapital);
    company.members.forEach((member) => {
      totalCapital += parseInt(member.capital);
    });

    if (totalCapital < 2500) {
      setMessage("Capital is less than 2500 with new capital of member");
      return false;
    }

    return true;
  };

  return (
    <div className="container">
      {company && (
        <div className="row">
          <h1>{`Handle ${company.name} membership`}</h1>
          <div className="col-12">
            {company.members.map((member, index) => (
              <div className={styles.member} key={index}>
                <p>{index + 1}</p>
                <p>{member.name}</p>
                {member.personal_code && <p>{member.personal_code}</p>}
                {member.reg_code && <p>{member.reg_code}</p>}
                {updatingCapital === member.id ? (
                  <div>
                    <input
                      type="number"
                      value={newCapital}
                      onChange={(e) => setNewCapital(e.target.value)}
                    />
                    <button
                      onClick={() => updateMembersCapital(member.membership_id)}
                    >
                      SAVE
                    </button>
                  </div>
                ) : (
                  <div className="">
                    <p>{member.capital} €</p>
                    <button onClick={() => setUpdatingCapital(member.id)}>
                      UPDATE
                    </button>
                  </div>
                )}
                <p>{member.role}</p>
                <p>{member.is_person ? "person" : "company"}</p>
              </div>
            ))}
          </div>
          <p>{message}</p>
          <div className={classNames("row", styles.card)}>
            <h1>Add member</h1>
            <div className="col-6">
              <h2>Person</h2>
              <PersonSearch
                handlePersonClick={handlePersonClick}
                members={company.members}
                membersLength={company.members.length}
              />
            </div>
            <div className="col-6">
              <h2>Company</h2>
              <CompanySearch
                handleCompanyClick={handleCompanyClick}
                members={[
                  ...company.members,
                  { reg_code: company.reg_code, name: company.name },
                ]}
                membersLength={company.members.length}
              />
            </div>
          </div>

          {showModal && (
            <AddMemberModal
              closeModal={() => setShowModal(false)}
              member={member}
              capital={capital}
              setCapital={setCapital}
              handleModalSubmit={handleModalSubmit}
              modalMessage={modalMessage}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default ChangeMembership;
