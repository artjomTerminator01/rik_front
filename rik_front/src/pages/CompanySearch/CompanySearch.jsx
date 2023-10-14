import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CompanySearch = () => {
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
        console.log(response.data);
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

      return companyMatch || memberMatch;
    });

    setSearchResults(filteredCompanies);
  }, [searchTerm, companies, searchByCompany, searchByMembers]);

  const isAnyFilterSelected = searchByCompany || searchByMembers;

  return (
    <div className="App">
      <h1>Company List</h1>
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div>
        <label>
          <input
            type="checkbox"
            checked={searchByCompany}
            onChange={() => setSearchByCompany(!searchByCompany)}
          />
          Search by Company
        </label>
        <label>
          <input
            type="checkbox"
            checked={searchByMembers}
            onChange={() => setSearchByMembers(!searchByMembers)}
          />
          Search by Members
        </label>
      </div>
      <ul>
        {isAnyFilterSelected ? (
          searchResults.map((company) => (
            <Link to={`/company/${company.id}`} key={company.id}>
              <div>
                {company.name} - {company.reg_code}
              </div>
            </Link>
          ))
        ) : (
          <li>No filters selected. Please choose at least one filter.</li>
        )}
      </ul>
    </div>
  );
};

export default CompanySearch;
