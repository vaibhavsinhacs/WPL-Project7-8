// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./styles.css";

// function LoginRegister() {
//   const [loginName, setLoginName] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post("/admin/login", { login_name: loginName });
//       if (response.status === 200) {
//         navigate("/"); // Redirect to the main view
//       }
//     } catch (err) {
//       setError("Login failed. Please try again.");
//     }
//   };

//   return (
//     <div className="login-register">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={loginName}
//           onChange={(e) => setLoginName(e.target.value)}
//           placeholder="Login Name"
//           required
//         />
//         <button type="submit">Login</button>
//       </form>
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }

// export default LoginRegister;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function LoginRegister() {
  const [loginName, setLoginName] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/admin/login", { login_name: loginName });
      if (response.status === 200) {
        const user = response.data;
        sessionStorage.setItem("user", JSON.stringify(user)); // Store user data in session storage
        navigate(`/users/${user._id}`); // Redirect to the UserDetail view for the logged-in user
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-register">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={loginName}
          onChange={(e) => setLoginName(e.target.value)}
          placeholder="Login Name"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default LoginRegister;
