import React from "react";
import { Link } from "react-router-dom";

const Unauthorized: React.FC = () => {
  return (
    <div className="error-page">
      <h1>403 - Unauthorized</h1>
      <p>You don't have permission to access this page.</p>
      <Link to="/">Go back to home</Link>
    </div>
  );
};

export default Unauthorized;
