import { makeStyles } from "@material-ui/core";
export default makeStyles((theme) => ({
  mainContainer: {
    display: "flex",
    alignItems: "center",
  },
  smMargin: {
    margin: theme.spacing(1),
  },
  actionDiv: {
    textAlign: "center",
  },
  paper: {
    position: "absolute",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  posts: {
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    position: "relative",
  },
  postsContainer: {
    position: "absolute",
    bottom: "10px",
    color: "#f91150",
  },
  postsCreateBtn: {
    position: "fixed",
    right: ".2em",
    bottom: "10px",
    fontSize: "3em !important",
    [theme.breakpoints.up("sm")]: {
      right: "1em",
    },
  },
  container: {
    scrollbarWidth: "none",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
}));

export function getModalStyle() {
  const top = 50,
    left = 50;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

// .post__comments {
//   max-height: 250px;
//   overflow: scroll;
//   /* Hide scrollbar for IE, Edge and Firefox */
//   -ms-overflow-style: none; /* IE and Edge */
//   scrollbar-width: none; /* Firefox */
// }
// /* Hide scrollbar for Chrome, Safari and Opera */
// .post__comments::-webkit-scrollbar {
//   display: none;
// }
