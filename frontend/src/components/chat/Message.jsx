"use client"

import {createStyles, makeStyles} from "@mui/styles";
import Avatar from "@material-ui/core/Avatar";
import {deepOrange} from "@material-ui/core/colors";
import ChatGPT from "../../../public/images/icons/gpt.png";
import {Box, Typography} from "@mui/material";
import Image from "next/image";

const useStyles = makeStyles((theme) =>
  createStyles({
    messageRow: {
      display: "flex"
    },
    image: {
      position: "relative",
      width: "48px",
      height: "48px"
    },
    messageRowRight: {
      display: "flex",
      justifyContent: "flex-end"
    },
    messageBlue: {
      minWidth: 240,
      position: "relative",
      marginLeft: "20px",
      marginBottom: "10px",
      paddingTop: "10px",
      paddingBottom: "15px",
      paddingLeft: "5px",
      paddingRight: "5px",
      backgroundColor: "#A8DDFD",
      width: "80%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #97C6E3",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #A8DDFD",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        left: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #97C6E3",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        left: "-17px"
      }
    },
    messageOrange: {
      position: "relative",
      marginRight: "20px",
      marginBottom: "10px",
      paddingTop: "10px",
      paddingBottom: "15px",
      paddingLeft: "5px",
      paddingRight: "5px",
      backgroundColor: "#f8e896",
      width: "75%",
      //height: "50px",
      textAlign: "left",
      font: "400 .9em 'Open Sans', sans-serif",
      border: "1px solid #dfd087",
      borderRadius: "10px",
      "&:after": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "15px solid #f8e896",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        top: "0",
        right: "-15px"
      },
      "&:before": {
        content: "''",
        position: "absolute",
        width: "0",
        height: "0",
        borderTop: "17px solid #dfd087",
        borderLeft: "16px solid transparent",
        borderRight: "16px solid transparent",
        top: "-1px",
        right: "-17px"
      }
    },

    messageContent: {
      padding: 0,
      margin: 0
    },
    messageTimeStampRight: {
      position: "absolute",
      fontSize: ".85em",
      fontWeight: "150",
      marginTop: "10px",
      bottom: "3px",
      right: "5px",
      fontStyle: "italic"
    },

    orange: {
      // color: theme.palette.getContrastText(deepOrange[500]),
      backgroundColor: deepOrange[500],
      // width: theme.spacing(4),
      // height: theme.spacing(4)
    },
    avatarNothing: {
      color: "transparent",
      backgroundColor: "transparent",
      // width: theme.spacing(4),
      // height: theme.spacing(4)
    },
    displayName: {
      marginLeft: "20px"
    }
  })
);

export const MessageLeft = (props) => {
  const message = props.message ? typeof props.message === 'string' || props.message instanceof String ? props.message : "Unexpected string" : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  const displayName = props.displayName ? props.displayName : "";
  const classes = useStyles();
  return (
    <>
      <Box className={classes.messageRow}>
        <Image
          alt={displayName}
          src={ChatGPT}
          className={classes.image}
        ></Image>
        <div>
          <div className={classes.displayName}>{displayName}</div>
          <div className={classes.messageBlue}>
            <div>
              <Typography component="p" className={classes.messageContent}>{message}</Typography>
            </div>
            <div className={classes.messageTimeStampRight}>{timestamp}</div>
          </div>
        </div>
      </Box>
    </>
  );
};

export const MessageRight = (props) => {
  const classes = useStyles();
  const message = props.message ? props.message : "no message";
  const timestamp = props.timestamp ? props.timestamp : "";
  return (
    <div className={classes.messageRowRight}>
      <div className={classes.messageOrange}>
        <p className={classes.messageContent}>{message}</p>
        <div className={classes.messageTimeStampRight}>{timestamp}</div>
      </div>
    </div>
  );
};
