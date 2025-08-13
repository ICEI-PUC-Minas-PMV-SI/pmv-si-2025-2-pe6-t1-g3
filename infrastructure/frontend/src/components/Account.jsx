import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../css/Account.css";
import Profile from "./Profile.jsx";
import Address from "./Address.jsx";
import History from "./History.jsx";

const Account = () => {
  const [selectedCheckbox, setSelectedCheckbox] = useState("checkbox-1a");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/account") {
      setSelectedCheckbox("checkbox-1a");
    }
  }, [location.pathname]);

  const handleCheckboxChange = (event) => {
    setSelectedCheckbox(event.target.id);
  };

  const renderComponent = () => {
    switch (selectedCheckbox) {
      case "checkbox-2a":
        return <Address />;
      case "checkbox-3a":
        return <History />;
      default:
        return <Profile />;
    }
  };

  return (
    <div className="account-page">
      <div className="header-account">
        <h1>Informações da sua conta</h1>
      </div>
      <div className="header-container-account">
        <aside className="left-container-account">
          <input type="checkbox" id="checkbox-1a" checked={selectedCheckbox === "checkbox-1a"} onChange={handleCheckboxChange} />
          <label htmlFor="checkbox-1a">Minha conta</label>

          <input type="checkbox" id="checkbox-2a" checked={selectedCheckbox === "checkbox-2a"} onChange={handleCheckboxChange} />
          <label htmlFor="checkbox-2a">Meu endereço</label>

          <input type="checkbox" id="checkbox-3a" checked={selectedCheckbox === "checkbox-3a"} onChange={handleCheckboxChange} />
          <label htmlFor="checkbox-3a">Meus pedidos</label>
        </aside>
        <article className="right-container-account">{renderComponent()}</article>
      </div>
    </div>
  );
};

export default Account;
