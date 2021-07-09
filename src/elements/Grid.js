import React from "react";
import styled from "styled-components";

const Grid = (props) => {
  const {
    is_flex,
    is_flex_main,
    is_mob,
    is_header,
    is_border,
    _onClick,
    width,
    margin,
    padding,
    bg,
    children,
    center,
    maxwidth,
    height,
  } = props;

  const styles = {
    is_flex: is_flex,
    is_flex_main: is_flex_main,
    is_mob: is_mob,
    is_header: is_header,
    is_border,
    width: width,
    margin: margin,
    padding: padding,
    bg: bg,
    center: center,
    maxwidth: maxwidth,
    height: height,
  };
  if (is_mob) {
    <React.Fragment>
      <GridBox {...styles} onClick={_onClick}>
        {children}
      </GridBox>
    </React.Fragment>;
  }
  return (
    <React.Fragment>
      <GridBox {...styles} onClick={_onClick}>
        {children}
      </GridBox>
    </React.Fragment>
  );
};

Grid.defaultProps = {
  chidren: null,
  is_flex: false,
  is_flex_main: false,
  is_mob: false,
  is_header: false,
  is_border: false,
  _onClick: () => {},
  width: "100%",
  padding: false,
  margin: false,
  bg: false,
  center: false,
  maxwidth: false,
  height: null,
};

const GridBox = styled.div`
  width: ${(props) => props.width};
  box-sizing: border-box;
  ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
  ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
  ${(props) => (props.bg ? `background: ${props.bg};` : "")}
  ${(props) =>
    props.is_flex
      ? `display: flex; align-items: center; justify-content: space-between;`
      : ""}
  ${(props) => (props.is_flex_main? `display: flex; justify-content: center; align-items: center;` : "")}
  ${(props) => (props.center ? `text-align: center;` : "")}
  ${(props) => (props.maxwidth ? `max-width: ${props.maxwidth};` : "")};
  ${(props) => (props.height ? `height: ${props.height}` : "")};
  ${(props) =>
    props.is_header ? `position: sticky; top: 0; z-index: 10;` : ""};
  ${(props) =>
    props.is_border
      ? `border: 1px solid black; border-radius: 0.4em; box-sizing: border-box`
      : `border: ${props.is_border}`}

  @media (max-width: 48.000em) {
    max-width: 36.75em;
    box-sizing: border-box;
    max-height: 100%;
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) => (props.bg ? `background: ${props.bg};` : "")}
    ${(props) =>
      props.is_flex
        ? `display: flex; align-items: center; justify-content: space-between;`
        : ""}
    ${(props) => (props.center ? `text-align: center;` : "")}
    ${(props) => (props.maxwidth ? `max-width: ${props.maxwidth};` : "")};
    ${(props) => (props.height ? `height: ${props.height}` : "")};
    ${(props) =>
      props.is_header ? `position: sticky; top: 0; z-index: 10;` : ""};
    ${(props) =>
      props.is_border
        ? `border: 1px solid black; border-radius: 0.4em; box-sizing: border-box`
        : `border: ${props.is_border}`}
  }
  @media (max-width: 22.500em) {
    /* max-width: 36.75em; */
    /* min-width: 24em; */
    /* ${(props) => (props.minwidth ? `min-width: ${props.minwidth};` : "")} */
    /* width: 100%; */
    box-sizing: border-box;
    max-height: 100%;
    ${(props) => (props.padding ? `padding: ${props.padding};` : "")}
    ${(props) => (props.margin ? `margin: ${props.margin};` : "")}
    ${(props) =>
      props.is_mob
        ? `background: linear-gradient(45deg, #e66465, #9198e5);`
        : ""};
    ${(props) =>
      props.is_flex
        ? `display: flex; align-items: center; justify-content: space-between;`
        : ""}
    ${(props) => (props.center ? `text-align: center;` : "")}
    // ${(props) => (props.maxwidth ? `max-width: ${props.maxwidth};` : "")};
    ${(props) => (props.height ? `height: ${props.height}` : "")};
    ${(props) =>
      props.is_header ? `width: 22.500em;position: sticky; z-index: 10;` : ""};
    ${(props) =>
      props.is_border
        ? `border: 1px solid black; border-radius: 0.4em; box-sizing: border-box`
        : `border: ${props.is_border}`}
  }
`;

export default Grid;
