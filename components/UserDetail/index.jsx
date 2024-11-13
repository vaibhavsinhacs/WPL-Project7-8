// import React, { useEffect, useState } from "react";
// import { Typography, Card, CardContent, Grid, Button } from "@mui/material";
// import { Link } from "react-router-dom"; // Import Link from react-router-dom
// import fetchModel from "../../lib/fetchModelData";
// import "./styles.css";

// function UserDetail({ userId }) {
//   const [user, setUser] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetchModel(`/user/${userId}`);
//         setUser(response.data);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   if (loading) {
//     return <Typography variant="body1">Loading...</Typography>;
//   }

//   if (error) {
//     return <Typography variant="body1" color="error">Error fetching user details: {error.statusText}</Typography>;
//   }

//   return (
//     // Display the content in card form
//     <Card className="user-detail-card">
//       <CardContent>
//         <Grid container spacing={2}>
//           <Grid item xs={12}>
//             <Typography variant="h5">
//               {user.first_name} {user.last_name}
//             </Typography>
//             <Typography variant="body2" color="textSecondary">
//               {user.occupation}
//             </Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Typography variant="body1">
//               <strong>Location:</strong> {user.location}
//             </Typography>
//             <Typography variant="body1">
//               <strong>Description:</strong> {user.description}
//             </Typography>
//           </Grid>
//           <Grid item xs={12}>
//             <Link to={`/photos/${userId}`} style={{ textDecoration: 'none' }}>
//               {/* Button to go to the photos page */}
//               <Button variant="contained" color="primary" className="view-photos-button">
//                 View Photos
//               </Button>
//             </Link>
//           </Grid>
//         </Grid>
//       </CardContent>
//     </Card>
//   );
// }

// export default UserDetail;



import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios"; // Import axios
import "./styles.css";

function UserDetail({ userId }) {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/user/${userId}`); // Use axios to fetch user data
        setUser(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        Error fetching user details: {error.response?.statusText || "Unknown error"}
      </Typography>
    );
  }

  return (
    <Card className="user-detail-card">
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5">
              {user.first_name} {user.last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {user.occupation}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              <strong>Location:</strong> {user.location}
            </Typography>
            <Typography variant="body1">
              <strong>Description:</strong> {user.description}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Link to={`/photos/${userId}`} style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" className="view-photos-button">
                View Photos
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default UserDetail;
