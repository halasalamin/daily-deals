import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  TextField,
  Rating,
  IconButton,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import classes from "./review.module.css";
import axios from "axios";
import {Snackbar, Alert} from "@mui/material";
const ReviewSection = ({ productId, user,  onAverageRatingChange }) => {
  const token = localStorage.getItem("token");
  const [comments, setComments] = useState([]);
  const [rating, setRating] = useState(null);
  const [comment, setComment] = useState("");
  const [showAllComments, setShowAllComments] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message:"", severity:"error"});

  const showSnackbar = (message, severity ="error") =>{
     setSnackbar({ open: true, message, severity})
  }

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };


  useEffect(() => {
    if (productId) fetchComments();
  }, [productId]);



  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/reviews/${productId}`);
      const reviews = response.data.data;
      setComments(reviews);

      // Calculate average rating
      const ratings = reviews
        .map((r) => r.rating)
        .filter((r) => r !== undefined && r !== null);

      if (ratings.length > 0) {
        const avg = ratings.reduce((acc, val) => acc + val, 0) / ratings.length;
        setAverageRating(avg);


      if (onAverageRatingChange) {
         onAverageRatingChange(avg);
      }
      } else {
        setAverageRating(0);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const handleReviewSubmit = async () => {
    if (!comment.trim() && rating === null) return;

    try {
      await axios.post(
        `http://localhost:4000/api/reviews/${productId}`,
        {
          comment: comment.trim(),
          rating: rating,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Refresh comments after submission
      await fetchComments();
      setComment("");
      setRating(null);
    } catch (error) {
      console.error("Error submitting review:", error);
      const msg = error.response?.data?.message || error.message || "An error occurred";
      showSnackbar(msg);
    }
  };

  return (
    <>
      <div className={classes.leaveReviewSection}>
        <p className={classes.title}>Leave a Review</p>
        <Rating
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
        />
        <TextField
          sx={{ width: "1000px", minWidth: "1000px", margin: 0 }}
          fullWidth
          variant="outlined"
          multiline
          rows={3}
          placeholder="Write your comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton color="primary" onClick={handleReviewSubmit}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className={classes.leaveReviewSection}>
        <p className={classes.title}>Customer Reviews</p>

        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="subtitle1" mr={1}>
            Average Rating:
          </Typography>
          <Rating value={averageRating} precision={0.1} readOnly />
          <Typography variant="body2" ml={1}>
            ({averageRating.toFixed(1)})
          </Typography>
        </Box>

        <List>
          {comments.length > 0 ? (
            (showAllComments ? comments : comments.slice(-5)).map((c, index) => (
              <ListItem
                key={index}
                sx={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                <Typography variant="body1">{c.comment || "No comment"}</Typography>
                {c.rating !== undefined && c.rating !== null && (
                  <Rating value={c.rating} readOnly />
                )}
                <Typography variant="caption" color="textSecondary">
                  {c.userId?.name || "Anonymous"}
                </Typography>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">No reviews yet.</Typography>
          )}
        </List>

        {comments.length > 5 && (
          <Box mt={2}>
            <Typography
              variant="body2"
              color="primary"
              sx={{ cursor: "pointer" }}
              onClick={() => setShowAllComments(!showAllComments)}
            >
              {showAllComments ? "Show Less" : "Show All Reviews"}
            </Typography>
          </Box>
        )}
      </div>
      <Snackbar
      open={snackbar.open}
      autoHideDuration={3000}
      onClose ={handleSnackbarClose}
      anchorOrigin={{vertical:"bottom", horizontal:"center"}}
      >
        <Alert
        onClose={handleSnackbarClose}
        severity = {snackbar.severity}
        sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default ReviewSection;
