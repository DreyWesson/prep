import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  // CardMedia,
  Button,
  Typography,
} from "@material-ui/core/";
import moment from "moment";
import {
  DeleteOutlined,
  Favorite,
  FavoriteBorderOutlined,
  MoreHorizOutlined,
} from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { showSnack } from "react-redux-snackbar";
import useStyles from "./styles";
import { setModal } from "../../../features/post/modalSlice";
import {
  deletePost,
  likePost,
  setCurrentId,
} from "../../../features/post/postsSlice";
import { snackMessages } from "../../../snackMessages";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export const Post = ({ post }) => {
  const classes = useStyles(),
    dispatch = useDispatch(),
    user = JSON.parse(localStorage.getItem("profile"));
  // console.log(post);

  const postEdit = () => {
    const currentUserID = user?.result?.googleId || user?.result._id;
    if (user) {
      if (post?.creator !== currentUserID) {
        return dispatch(
          showSnack("unauthorized", {
            label: snackMessages.unauthorized,
            timeout: 6000,
          })
        );
      }
    } else {
      dispatch(
        showSnack("isUser", {
          label: snackMessages.isUser,
          timeout: 6000,
        })
      );
    }
    dispatch(setModal(true));
    dispatch(setCurrentId(post._id));
  };

  const currentUserDelActions = (action = "") => {
    const currentUserID = user?.result?.googleId || user?.result?._id;
    if (user) {
      currentUserID === post?.creator
        ? action()
        : dispatch(
            showSnack("userUnauthorized", {
              label: snackMessages.unauthorized,
              timeout: 6000,
            })
          );
    } else
      dispatch(
        showSnack("isUser", {
          label: snackMessages.isUser,
          timeout: 6000,
        })
      );
  };

  const currentUserLikeActions = (action) => {
    user
      ? action()
      : dispatch(
          showSnack("isUser", {
            label: snackMessages.isUser,
            timeout: 6000,
          })
        );
  };

  const Likes = () => {
    if (post.likes.length > 0) {
      return post.likes.find(
        (like) => like === (user?.result?.googleId || user?.result?._id)
      ) ? (
        <>
          <Favorite fontSize="small" />
          &nbsp;
          {post.likes.length > 2
            ? `You and ${post.likes.length - 1} others`
            : `${post.likes.length} like${post.likes.length > 1 ? "s" : ""}`}
        </>
      ) : (
        <>
          <Favorite fontSize="small" />
          &nbsp;{post.likes.length} {post.likes.length === 1 ? "Like" : "Likes"}
        </>
      );
    }

    return (
      <>
        <FavoriteBorderOutlined fontSize="small" />
        &nbsp;Like
      </>
    );
  };
  const del = () => dispatch(deletePost({ id: post._id }));
  const fav = () => dispatch(likePost({ id: post._id }));

  // var thumb = new Buffer(result.image.data).toString('base64');

  return (
    <Card className={classes.card}>
      <Zoom>
        <img
          style={{ maxWidth: "100%", maxHeight: "auto", overflowY: "hidden" }}
          src={
            post.selectedFile ||
            "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
          }
          alt={post.title}
        />
      </Zoom>
      {/* <CardMedia
        className={classes.media}
        image={
          post.selectedFile ||
          "https://user-images.githubusercontent.com/194400/49531010-48dad180-f8b1-11e8-8d89-1e61320e1d82.png"
        }
        title={post.title}
      /> */}
      <div className={classes.overlay}>
        <Typography variant="h2" className={classes.smallHeading}>
          {post.name}
        </Typography>
        <Typography variant="body2">
          {moment(post.createdAt).fromNow()}
        </Typography>
      </div>
      <div className={classes.overlay2}>
        <Button
          aria-label="edit"
          style={{ color: "white" }}
          size="small"
          onClick={postEdit}
        >
          <MoreHorizOutlined fontSize="default" />
        </Button>
      </div>
      <div className={classes.details}>
        <Typography variant="body2" color="textSecondary" component="h2">
          {post.tags.map((tag) => `#${tag} `)}
        </Typography>
      </div>
      <Typography
        className={classes.title}
        gutterBottom
        variant="h5"
        component="h2"
      >
        {post.title}
      </Typography>
      <CardContent>
        <Typography variant="body2" color="textSecondary" component="p">
          {post.message}
        </Typography>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          size="small"
          className={classes.btnColor}
          onClick={
            // fav
            (e) => {
              e.preventDefault();
              currentUserLikeActions(fav);
            }
          }
        >
          <Likes />
        </Button>
        <Button
          size="small"
          className={classes.btnColor}
          onClick={(e) => {
            e.preventDefault();
            currentUserDelActions(del);
          }}
        >
          <DeleteOutlined fontSize="small" /> Delete
        </Button>
      </CardActions>
    </Card>
  );
};
