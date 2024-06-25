import React, { useEffect } from "react";
import { Grid, Grow } from "@material-ui/core";
import Pusher from "pusher-js";
import { useDispatch } from "react-redux";
import { Posts } from "..";
import { fetchPosts } from "../../features/post/postsSlice";

export const Home = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  useEffect(() => {
    // Pusher.logToConsole = true;
    const pusher = new Pusher("4f051944159df55f7c75", {
      cluster: "eu",
    });
    const pusherAction = (data) => {
      dispatch(fetchPosts());
    };

    const pushPost = pusher.subscribe("posts");
    pushPost.bind("inserted", pusherAction);
    pushPost.bind("deleted", pusherAction);
    pushPost.bind("updated", pusherAction);
  }, [dispatch]);
  return (
    <Grow in>
      <Grid container justify="space-between" alignItems="stretch" spacing={3}>
        <Grid item xs={12}>
          <Posts />
        </Grid>
      </Grid>
    </Grow>
  );
};
