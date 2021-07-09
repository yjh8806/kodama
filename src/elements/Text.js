import React from "react";
import styled from "styled-components";

const Text = (props) => {
  const {
    _onClick,
    bold,
    color,
    size,
    children,
    margin,
    main,
    height,
    padding,
    radioSelect,
    radioUpDown,
  } = props;

  const styles = {
    bold: bold,
    color: color,
    size: size,
    margin,
    main,
    height,
    padding,
    _onClick: () => {},
  };

  if (radioSelect) {
    return <Div {...styles}>{children}</Div>;
  }
  if (radioUpDown) {
    return <DivUpDown {...styles}>{children}</DivUpDown>;
  }
  return <P {...styles}>{children}</P>;
};

Text.defaultProps = {
  children: null,
  bold: false,
  color: "#222831",
  size: "14px",
  margin: false,
  main: false,
  height: null,
  padding: false,
};

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.size};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) =>
    props.main
      ? `justify-content: center; align-items: center; text-align: center; display: flex;`
      : ""}
  ${(props) => (props.height ? `height: ${props.height};` : "")}
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  @media (max-width: 22.5em) {
    width: 6em;
    color: ${(props) => props.color};
    font-size: ${(props) => props.size};
    font-weight: ${(props) => (props.bold ? "600" : "400")};
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) =>
      props.main
        ? `justify-content: center; align-items: center; text-align: center; display: flex; margin: 0em 1em 0em 0em;`
        : ""}
  ${(props) => (props.height ? `height: ${props.height};` : "")}
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  }
`;

const Div = styled.div`
  display: flex;
  flex-direction: column;
  position: sticky;
  color: ${(props) => props.color};
  font-weight: ${(props) => (props.bold ? "600" : "400")};
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.height ? `height: ${props.height};` : "")}
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  width: 19em;
  height: 14.3em;
  max-height: 20em;
  padding: 16px;
  /* text-align: center; */
  /* line-height: 17.1em; */
  word-break: break-all;
  word-wrap: break-word;
  flex-wrap: wrap;
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: pre-wrap;
  font-weight: 500;
  font-size: 1em;
  text-align: center;
  /* background-color: green; */
`;

const DivUpDown = styled.div`
  /* display: block; */
  color: ${(props) => props.color};
  font-size: 1em;
  font-weight: 500;
  text-align: center;
  margin: 0px auto;
  ${(props) => (props.height ? `height: ${props.height};` : "")}
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  width: auto; // 36.3em
  height: 5.5em;
  /* margin: 0em 0em 0em 7.45em; */
  max-height: 30em;
  padding: 16px;
  /* line-height: 17.1em; */
  word-break: break-all;
  word-wrap: break-word;
  /* overflow-x: hidden; */
  /* overflow-wrap: break-word; */
  overflow-x: hidden;
  overflow-y: hidden;
  white-space: pre-wrap;
  /* background-color: green; */

  @media (max-width: 47.938em) {
    /* display: block; */
    color: ${(props) => props.color};
    font-size: ${(props) => props.size};
    font-weight: ${(props) => (props.bold ? "600" : "400")};
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) => (props.height ? `height: ${props.height};` : "")}
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    width: 24.8em;
    height: 5.5em;
    /* margin: 0em 0em 0em 7.45em; */
    max-height: 30em;
    padding: 16px;
    /* line-height: 17.1em; */
    word-break: break-all;
    word-wrap: break-word;
    /* overflow-x: hidden; */
    /* overflow-wrap: break-word; */
    overflow-x: hidden;
    overflow-y: hidden;
    white-space: pre-wrap;
    margin: 0px auto;
    /* background-color: green; */
  } ;
`;

export default Text;
