import React, { useEffect, useState } from "react";
import { Typography, Card, CardContent, Grid, CardMedia, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";
import axios from "axios";
import "./styles.css";

function UserPhotos({ userId }) {
  const [photos, setPhotos] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState({}); // State to manage comments for each photo

  useEffect(() => {
    const fetchData = async () => {
      try {
        const photosResponse = await axios.get(`/photosOfUser/${userId}`);
        setPhotos(photosResponse.data);

        const userResponse = await axios.get(`/user/${userId}`);
        setUser(userResponse.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCommentChange = (photoId, value) => {
    setComments({
      ...comments,
      [photoId]: value,
    });
  };

  const handleCommentSubmit = async (photoId) => {
    if (!comments[photoId]) {
      return; // Reject empty comments
    }

    try {
      await axios.post(`/commentsOfPhoto/${photoId}`, { comment: comments[photoId] });
      setPhotos((prevPhotos) => {
        const updatedPhotos = prevPhotos.map(photo => {
          if (photo._id === photoId) {
            return {
              ...photo,
              comments: [
                ...photo.comments,
                {
                  _id: new Date().getTime(), // Temporary ID, replace with actual from the backend if needed
                  comment: comments[photoId],
                  user: {
                    _id: user._id,
                    first_name: user.first_name,
                    last_name: user.last_name
                  },
                  date_time: new Date()
                }
              ]
            };
          }
          return photo;
        });
        return updatedPhotos;
      });
      setComments({
        ...comments,
        [photoId]: "", // Clear the input field for the specific photo
      });
    } catch (err) {
      setError("Failed to add comment");
    }
  };

  if (loading) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  if (error) {
    return (
      <Typography variant="body1" color="error">
        Error fetching data: {error.response?.statusText || "Unknown error"}
      </Typography>
    );
  }

  return (
    <div className="user-photos-container">
      <Typography variant="h5" gutterBottom>
        Photos of {user ? `${user.first_name} ${user.last_name}` : "Unknown User"}
      </Typography>
      <Grid container spacing={2}>
        {photos.length > 0 ? (
          photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} key={photo._id}>
              <Card className="photo-card">
                <CardMedia
                  component="img"
                  alt="User Photo"
                  height="200"
                  image={`../../images/${photo.file_name}`}
                />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {new Date(photo.date_time).toLocaleString("en-US", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Typography>
                  <Typography variant="body1">Comments:</Typography>
                  {photo.comments && photo.comments.length > 0 ? (
                    photo.comments.map((comment) => (
                      <div key={comment._id} className="comment">
                        <Typography variant="caption">
                          <Link to={`/users/${comment.user._id}`} className="commenter-link">
                            <strong>{comment.user.first_name} {comment.user.last_name}: </strong>
                          </Link>
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {comment.comment}
                        </Typography>
                        <div className="comment-date">
                          <Typography variant="caption" color="textSecondary">
                            {new Date(comment.date_time).toLocaleString("en-US", {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Typography>
                        </div>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2">No comments available.</Typography>
                  )}
                  <div className="add-comment">
                    <TextField
                      label="Add a comment"
                      variant="outlined"
                      fullWidth
                      value={comments[photo._id] || ""}
                      onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                      size="small"
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCommentSubmit(photo._id)}
                      disabled={!comments[photo._id]}
                    >
                      Submit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2">No photos available.</Typography>
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default UserPhotos;
