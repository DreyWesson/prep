import { Grid, Modal } from "@material-ui/core";
import React, { useState } from "react";
import { MonochromePhotosOutlined } from "@material-ui/icons/";
import { Post } from "./Post/Post";
import { ErrorPage, Loader } from "..";
import useStyles, { getModalStyle } from "./styles";
import { useDispatch, useSelector } from "react-redux";
import { selectPosts, setCurrentId } from "../../features/post/postsSlice";
import { selectModal, setModal } from "../../features/post/modalSlice";
import { InputForm } from "../Form/Index";

export const Posts = () => {
  const dispatch = useDispatch(),
    [modalStyle] = useState(getModalStyle),
    classes = useStyles(),
    { posts, hasErrors } = useSelector(selectPosts),
    { open } = useSelector(selectModal);

  return (
    <>
      {hasErrors ? (
        <ErrorPage />
      ) : !posts?.length ? (
        <Loader />
      ) : (
        <Grid
          className={classes.container}
          container
          alignItems="stretch"
          spacing={3}
        >
          {posts?.map((post) => (
            <Grid key={post._id} item xs={12} sm={4} md={3}>
              <Post post={post} />
            </Grid>
          ))}
        </Grid>
      )}
      <div className={classes.postsContainer}>
        <MonochromePhotosOutlined
          className={classes.postsCreateBtn}
          onClick={() => dispatch(setModal(true))}
        />
      </div>
      <Modal
        open={open}
        onClose={() => {
          dispatch(setModal(false));
          dispatch(setCurrentId(null));
        }}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <div style={modalStyle} className={classes.paper}>
          <InputForm />
        </div>
      </Modal>
    </>
  );
};
