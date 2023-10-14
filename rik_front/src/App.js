import { Routes, Route } from "react-router-dom";
import { Company, CreateCompany, CreateUser, Home } from "./pages";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company/:companyId" element={<Company />} />
      <Route path="/create-company" element={<CreateCompany />} />
      <Route path="/create-person" element={<CreateUser />} />
    </Routes>
  );
};

export default App;
