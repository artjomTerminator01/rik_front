import { Routes, Route } from "react-router-dom";
import { ChangeMembership, Company, CreateCompany, Home } from "./components";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:companyRegCode" element={<Company />} />
        <Route
          path="/company/:companyRegCode/change-membership"
          element={<ChangeMembership />}
        />
        <Route path="/create-company" element={<CreateCompany />} />
      </Routes>
    </>
  );
};

export default App;
