import { makeStyles } from "@material-ui/core";
import { deepPurple } from "@material-ui/core/colors";

export default makeStyles((theme) => ({
  profile: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "250px",
    [theme.breakpoints.up("sm")]: {
      width: "400px",
    },
  },
  userName: {
    textAlign: "center",
    flex: 0.9,
  },
  btn: {
    padding: "3px 5px",
  },
  leftPad: {
    paddingLeft: "5px",
  },
  root: {
    "& .MuiSnackbarContent-action": {
      marginLeft: 0,
      paddingLeft: 0,
    },
    "& .MuiSnackbarContent-root": {
      justifyContent: "space-around",
      padding: "0 0px",
      [theme.breakpoints.up("sm")]: {
        padding: "0 7px",
      },
    },
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[300]),
    backgroundColor: deepPurple[300],
  },
}));
