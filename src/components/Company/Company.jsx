import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./company.module.scss";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

function Company() {
  const navigate = useNavigate();

  const [company, setCompany] = useState();

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

  return (
    <div className="container">
      {company && (
        <div className="row">
          <div className={classNames(styles.card, "col-8 offset-2")}>
            <div className={styles.infoRow}>
              <h1>{company.name}</h1>
              <img
                width={50}
                height={50}
                src="/assets/company.png"
                alt={company.name}
              />
            </div>

            <div className={styles.infoRow}>
              <p>Registration code:</p>
              <p>{company.reg_code}</p>
            </div>
            <div className={styles.infoRow}>
              <p>Foundation date:</p>
              <p>{company.created_at}</p>
            </div>
            <div className={styles.infoRow}>
              <p>Capital:</p>
              <p>{company.capital} €</p>
            </div>
          </div>
          <div className={classNames(styles.card, "col-8 offset-2")}>
            <div className={styles.membersWrapper}>
              <h2>Total of {company.members.length} members</h2>
              {company.members.map((member, index) => (
                <div className={styles.member} key={index}>
                  <p className={styles.indexWrapper}>{index + 1}</p>
                  <p className={styles.name}>{member.name}</p>
                  {member.personal_code && <p>{member.personal_code}</p>}
                  {member.reg_code && <p>{member.reg_code}</p>}
                  <p>{member.capital} €</p>
                  <p>{member.role}</p>
                  <p>{member.is_person ? "person" : "company"}</p>
                  <img
                    width={25}
                    height={25}
                    src={
                      member.is_person
                        ? "/assets/user.png"
                        : "/assets/company.png"
                    }
                    alt={member.name}
                  />
                </div>
              ))}
            </div>
          </div>
          <button
            className={styles.buttonWrapper}
            onClick={() =>
              navigate(`/company/${company.reg_code}/change-membership`)
            }
          >
            CHANGE MEMBERSHIP
          </button>
        </div>
      )}
    </div>
  );
}

export default Company;
