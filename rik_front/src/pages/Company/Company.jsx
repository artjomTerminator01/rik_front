import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Company() {
  const [company, setCompany] = useState();

  const { companyId } = useParams();

  useEffect(() => {
    const api = axios.create({
      baseURL: "http://127.0.0.1:8000",
    });
    api
      .get(`/company/${companyId}`)
      .then((response) => {
        setCompany(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return <div className="Company">{company && <h1>{company.name}</h1>}</div>;
}

export default Company;
