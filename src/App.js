import { Routes, Route } from "react-router-dom";
import { Company, CreateCompany, CreateUser, Home } from "./components";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/company/:companyRegCode" element={<Company />} />
        <Route path="/create-company" element={<CreateCompany />} />
        <Route path="/create-person" element={<CreateUser />} />
      </Routes>
    </>
  );
};

export default App;
