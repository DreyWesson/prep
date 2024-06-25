import { makeStyles } from "@material-ui/core";
// import { deepPurple } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  appBar: {
    borderRadius: 15,
    marginBottom: "20px",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderLeft: "5px solid #fe3d71",
    [theme.breakpoints.down("md")]: {
      borderLeft: "2px solid #fe3d71",
    },
  },
  heading: {
    color: "rgb(91, 93, 94)",
    fontSize: "20px",
    [theme.breakpoints.up("sm")]: {
      fontSize: "30px",
    },
  },
  capsule: {
    backgroundColor: "#f91150",
    borderRadius: "0 25px 25px 0",
    padding: "2px 7px 2px 2px",
    color: "white",
  },
  profile: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "220px",
    [theme.breakpoints.up("sm")]: {
      width: "400px",
    },
  },
  brandContainer: {
    display: "flex",
    alignItems: "center",
  },
  snackbar: {
    paddingRight: "5px",
    [theme.breakpoints.up("sm")]: {
      paddingRight: "20px",
    },
  },
}));
