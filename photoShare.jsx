// import React from "react";
// import ReactDOM from "react-dom/client";
// // import { Grid, Typography, Paper } from "@mui/material";
// import { Grid, Paper } from "@mui/material";
// import { HashRouter, Route, Routes, useParams } from "react-router-dom";

// import "./styles/main.css";
// import TopBar from "./components/TopBar";
// import UserDetail from "./components/UserDetail";
// import UserList from "./components/UserList";
// import UserPhotos from "./components/UserPhotos";

// function UserDetailRoute() {
//   const {userId} = useParams();
//   console.log("UserDetailRoute: userId is:", userId);
//   return <UserDetail userId={userId} />;
// }


// function UserPhotosRoute() {
//   const {userId} = useParams();
//   return <UserPhotos userId={userId} />;
// }

// function PhotoShare() {
//   return (
//     <HashRouter>
//       <div>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <TopBar />
//           </Grid>
//           <div className="main-topbar-buffer" />
//           <Grid item sm={3}>
//             <Paper className="main-grid-item">
//               <UserList />
//             </Paper>
//           </Grid>
//           <Grid item sm={9}>
//             <Paper className="main-grid-item">
//               <Routes>
//                 <Route path="/users/:userId" element={<UserDetailRoute />} />
//                 <Route path="/photos/:userId" element={<UserPhotosRoute />} />
//                 <Route path="/users" element={<UserList />} />
//               </Routes>
//             </Paper>
//           </Grid>
//         </Grid>
//       </div>
//     </HashRouter>
//   );
// }


// const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
// root.render(<PhotoShare />);


import React from "react";
import ReactDOM from "react-dom/client";
import { Grid, Paper } from "@mui/material";
import { HashRouter, Route, Routes, Navigate, useParams } from "react-router-dom";

import "./styles/main.css";
import TopBar from "./components/TopBar";
import UserDetail from "./components/UserDetail";
import UserList from "./components/UserList";
import UserPhotos from "./components/UserPhotos";
import LoginRegister from "./components/LoginRegister";

function UserDetailRoute() {
  const { userId } = useParams();
  return <UserDetail userId={userId} />;
}

function UserPhotosRoute() {
  const { userId } = useParams();
  return <UserPhotos userId={userId} />;
}

function PhotoShare() {
  const isLoggedIn = Boolean(sessionStorage.getItem("user")); // Check login status from sessionStorage

  return (
    <HashRouter>
      <div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TopBar />
          </Grid>
          <div className="main-topbar-buffer" />
          <Grid item sm={3}>
            <Paper className="main-grid-item">
              <UserList />
            </Paper>
          </Grid>
          <Grid item sm={9}>
            <Paper className="main-grid-item">
              <Routes>
                <Route path="/login-register" element={<LoginRegister />} />
                <Route path="/users/:userId" element={isLoggedIn ? <UserDetailRoute /> : <Navigate to="/login-register" />} />
                <Route path="/photos/:userId" element={isLoggedIn ? <UserPhotosRoute /> : <Navigate to="/login-register" />} />
                <Route path="/users/" element={isLoggedIn ? <UserList /> : <Navigate to="/login-register" />} />
                <Route path="*" element={<Navigate to="/login-register" />} />
              </Routes>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </HashRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById("photoshareapp"));
root.render(<PhotoShare />);
