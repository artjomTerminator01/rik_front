import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./companySearch.module.scss";

const CompanySearch = ({ handleCompanyClick, members, membersLength }) => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchByCompany, setSearchByCompany] = useState(true);
  const [searchByMembers, setSearchByMembers] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const api = axios.create({
      baseURL: "http://127.0.0.1:8000",
    });
    api
      .get("/companies")
      .then((response) => {
        setCompanies(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  useEffect(() => {
    const filteredCompanies = companies.filter((company) => {
      const companyMatch =
        searchByCompany &&
        (company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.reg_code.includes(searchTerm));

      const memberMatch =
        searchByMembers &&
        company.members.some((member) => {
          return (
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (member.reg_code && member.reg_code.includes(searchTerm)) ||
            (member.personal_code && member.personal_code.includes(searchTerm))
          );
        });

      if (members) {
        if (members.length > 0) {
          const companyHasMatchingMember = members.some(
            (member) => member.reg_code === company.reg_code
          );
          return !companyHasMatchingMember;
        }
      }

      return companyMatch || memberMatch;
    });

    setSearchResults(filteredCompanies);
  }, [
    searchTerm,
    companies,
    searchByCompany,
    searchByMembers,
    membersLength,
    members,
  ]);

  const isAnyFilterSelected = searchByCompany || searchByMembers;

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className={styles.optionsWrapper}>
        <div className={styles.option}>
          <label> Search by Company </label>
          <input
            type="checkbox"
            checked={searchByCompany}
            onChange={() => setSearchByCompany(!searchByCompany)}
          />
        </div>

        <div className={styles.option}>
          <label> Search by Members </label>
          <input
            type="checkbox"
            checked={searchByMembers}
            onChange={() => setSearchByMembers(!searchByMembers)}
          />
        </div>
      </div>
      {isAnyFilterSelected ? (
        searchResults.map((company) => (
          <div key={company.reg_code} className={styles.company}>
            <Link
              to={`/company/${company.reg_code}`}
              className={styles.linkWrapper}
            >
              <p className={styles.name}>{company.name}</p>
              <p>
                Reg code: <span>{company.reg_code}</span>
              </p>
            </Link>
            {handleCompanyClick ? (
              <button onClick={() => handleCompanyClick(company)}>
                Add company
              </button>
            ) : (
              <p className={styles.capital}>{company.capital} €</p>
            )}
          </div>
        ))
      ) : (
        <p>No filters selected. Please choose at least one filter.</p>
      )}
    </div>
  );
};

export default CompanySearch;
