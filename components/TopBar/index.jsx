// import React, { useEffect, useState } from "react";
// import { AppBar, Toolbar, Typography } from "@mui/material";
// import { useLocation } from "react-router-dom";
// import axios from "axios"; // Import axios
// import "./styles.css";

// function TopBar() {
//   const location = useLocation();
//   const [version, setVersion] = useState(""); // State for version
//   const [user, setUser] = useState(null); // State for user details
//   const userId = location.pathname.split("/")[2]; // Extract userId from URL

//   // Fetch version info on component mount
//   useEffect(() => {
//     axios.get("http://localhost:3000/test/info")
//       .then(response => {
//         setVersion(response.data.__v); // Set version from __v field
//       })
//       .catch(err => {
//         console.error("Failed to fetch version info:", err.response?.statusText || err.message);
//       });
//   }, []);

//   // Fetch user details if on a user or photos page
//   useEffect(() => {
//     if (location.pathname.startsWith("/users/") || location.pathname.startsWith("/photos/")) {
//       axios.get(`/user/${userId}`)
//         .then(response => {
//           setUser(response.data); // Set user details
//         })
//         .catch(err => {
//           console.error("Failed to fetch user details:", err.response?.statusText || err.message);
//         });
//     }
//   }, [userId, location.pathname]);

//   // Determine context text based on the current path
//   let contextText = "";
//   if (location.pathname.startsWith("/photos/") && user) {
//     contextText = `Photos of ${user.first_name} ${user.last_name}`;
//   } else if (user) {
//     contextText = `${user.first_name} ${user.last_name}`;
//   }

//   return (
//     <AppBar className="topbar-appBar" position="absolute">
//       <Toolbar>
//         <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
//           Vaibhav Sinha
//         </Typography>
//         <Typography variant="h6" color="inherit" className="version-text">
//           Version {version && `${version}`} {/* Display version */}
//         </Typography>
//         <Typography variant="h6" color="inherit">
//           {contextText}
//         </Typography>
//       </Toolbar>
//     </AppBar>
//   );
// }

// export default TopBar;


import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function TopBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [version, setVersion] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3000/test/info")
      .then(response => {
        setVersion(response.data.__v);
      })
      .catch(err => {
        console.error("Failed to fetch version info:", err.response?.statusText || err.message);
      });
  }, []);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    axios.post("/admin/logout")
      .then(() => {
        sessionStorage.removeItem("user"); // Remove user data from session storage
        setUser(null);
        navigate("/login-register");
      })
      .catch(err => {
        console.error("Logout failed:", err.response?.statusText || err.message);
      });
  };

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar>
        <Typography variant="h5" color="inherit" style={{ flexGrow: 1 }}>
          Vaibhav Sinha
        </Typography>
        <Typography variant="h6" color="inherit" className="version-text">
          Version {version && `${version}`}
        </Typography>
        {user ? (
          <div>
            <Typography variant="h6" color="inherit">
              Hi {user.first_name}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <Typography variant="h6" color="inherit">
            Please Login
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
