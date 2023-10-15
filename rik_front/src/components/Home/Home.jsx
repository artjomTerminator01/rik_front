import React from "react";
import CompanySearch from "../CompanySearch";

const Home = () => {
  return (
    <div className="container">
      <div className="row">
        <div className="col-8 offset-2">
          <CompanySearch />
        </div>
      </div>
    </div>
  );
};

export default Home;
