import React from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";

// Components
import Homepage from "./components/homepage/homepage";
import Navbar from "./components/navbar/navbar";
import Users from "./components/users/list";
import Edit from "./components/users/edit";
import Create from "./components/users/create";
// import css
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route exact path="/users" element={<Users />} />
          <Route path="/users/edit/:id" element={<Edit />} />
          <Route path="/users/create" element={<Create />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
