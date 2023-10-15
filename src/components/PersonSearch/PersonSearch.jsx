import React, { useEffect, useState } from "react";
import styles from "./personSearch.module.scss";
import axios from "axios";

const PersonSearch = ({ handlePersonClick, members, membersLength }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [people, setPeople] = useState([]);

  useEffect(() => {
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

  useEffect(() => {
    const filteredResults = people.filter(
      (person) =>
        (person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          person.personal_code.includes(searchTerm)) &&
        !members.some((m) => m.personal_code === person.personal_code)
    );
    setSearchResults(filteredResults);
  }, [searchTerm, people, members, membersLength]);

  return (
    <div>
      <div>
        <input
          type="text"
          placeholder="Search by name or personal code"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          {searchResults.map((person) => (
            <div className={styles.personWrapper} key={person.id}>
              <div>
                <p className={styles.name}>{person.name}</p>
                <p>
                  Personal code: <span>{person.personal_code}</span>
                </p>
              </div>
              <div className={styles.imageBlock}>
                <img src="/assets/user.png" height={40} alt={person.name} />
                <button onClick={() => handlePersonClick(person)}>
                  Add person
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonSearch;
