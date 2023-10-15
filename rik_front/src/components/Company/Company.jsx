import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import styles from "./company.module.scss";
import classNames from "classnames";
function Company() {
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
  }, []);

  return (
    <div className="container">
      {company && (
        <div className="row">
          <div className={classNames(styles.card, "col-4")}>
            <h1>{company.name}</h1>
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
          <div className={classNames(styles.card, "col-8")}>
            <h2>Total of {company.members.length} members</h2>
            {company.members.map((member, index) => (
              <div className={styles.member} key={index}>
                <p>{index + 1}</p>
                <p>{member.name}</p>
                <p>{member.personal_code}</p>
                <p>{member.capital} €</p>
                <p>{member.role}</p>
                <p>{member.is_person ? "person" : "company"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Company;
