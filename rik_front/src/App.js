import { Routes, Route } from "react-router-dom";
import { Company, CreateCompany, Home } from "./pages";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company/:companyId" element={<Company />} />
      <Route path="/create" element={<CreateCompany />} />
    </Routes>
  );
};

export default App;
