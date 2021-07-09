import styled from "styled-components";
import React from "react";
import Text from "./Text";
import kodama from "../shared/kodama_icon.jpeg";

const Image = (props) => {
  const { shape, src, size, opacity, _onClick, contents, is_flex } = props;

  const styles = {
    src: src,
    size: size,
    opacity: opacity,
    is_flex: is_flex,
  };

  if (shape === "circle") {
    return <ImageCircle {...styles} onClick={_onClick}></ImageCircle>;
  }
  if (shape === "main_circle") {
    return <MainCircle {...styles} onClick={_onClick}></MainCircle>;
  }

  if (shape === "rectangle") {
    return (
      <AspectOutter>
        <AspectInner {...styles}></AspectInner>
      </AspectOutter>
    );
  }

  if (shape === "heart") {
    return <ImageCircle {...styles} onClick={_onClick}></ImageCircle>;
  }

  if (shape === "leftTxtRightImg") {
    return (
      <RadioDiv {...styles}>
        <Text radioSelect>{contents}</Text>
        <RadioSide {...styles} onClick={_onClick} />
      </RadioDiv>
    );
  }

  if (shape === "leftImgRightTxt") {
    return (
      <RadioDiv {...styles}>
        <RadioSide {...styles} onClick={_onClick} />
        <Text radioSelect>{contents}</Text>
      </RadioDiv>
    );
  }

  if (shape === "AboveTxtBeneathImg") {
    return (
      <RadioDiv {...styles}>
        <Text radioUpDown>{contents}</Text>
        <RadioUpDown {...styles} onClick={_onClick} />
      </RadioDiv>
    );
  }

  return (
    <React.Fragment>
      <ImageDefault {...styles}></ImageDefault>
    </React.Fragment>
  );
};

Image.defaultProps = {
  shape: "circle",
  src: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  size: 36,
  opacity: null,
  _onClick: () => {},
  contents: false,
  is_flex: false,
};

const ImageDefault = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  background-image: url("${(props) => props.src}");
  background-size: cover;
`;

const AspectOutter = styled.div`
  width: 100%;
  min-width: 250px;
`;

const AspectInner = styled.div`
  position: relative;
  padding-top: 75%;
  overflow: hidden;
  background-image: url("${(props) => props.src}");
  background-size: cover;
  background-position: center;
`;

const ImageCircle = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);
  border-radius: var(--size);

  background-image: url("${(props) => props.src}");
  opacity: ${(props) => props.opacity};
  background-size: cover;
  background-position: center;
  margin: 0em 0.7em 0em 0em;
`;

const MainCircle = styled.div`
  --size: 3.5em;
  width: var(--size);
  height: var(--size);
  /* border-radius: var(--size); */

  background-image: url("${(props) => props.src}");
  opacity: ${(props) => props.opacity};
  background-size: cover;
  background-position: center;
  background-color: white;
  /* margin: 4px; */

  @media (max-width: 22.5em) {
    --size: 3.5em;
    width: var(--size);
    height: var(--size);
    /* border-radius: var(--size); */

    background-image: url("${(props) => props.src}");
    opacity: ${(props) => props.opacity};
    background-size: cover;
    background-position: center;
    background-color: white;
    margin: 0em 0em 0em;
  }
`;

const ImageHeart = styled.div`
  --size: ${(props) => props.size}px;
  width: var(--size);
  height: var(--size);

  background-image: url("${(props) => props.src}");
  opacity: ${(props) => props.opacity};
  background-size: cover;
  margin: 4px;
`;

const RadioDiv = styled.div`
  width: 100%;
  max-height: 100vh;
  /* min-width: 250px; */
  /* overflow: hidden; */
  ${(props) =>
    props.is_flex
      ? `display: flex; justify-content: center; align-items: center;`
      : ""}
`;
const RadioSide = styled.div`
  /* position: sticky; */
  background-image: url("${(props) => props.src}");
  background-size: cover;
  background-position: center;
  width: 21em;
  height: 16.3em;
`;

const RadioUpDown = styled.div`
  /* position: sticky; */
  background-image: url("${(props) => props.src}");
  background-size: cover;
  background-position: center;
  /* width: 33.75em; */
  width: 33.8em;
  height: 22em;
  margin: 0px auto;
  @media (max-width: 63.938em) {
    /* position: sticky; */
    background-image: url("${(props) => props.src}");
    background-size: cover;
    background-position: center;
    /* width: 33.75em; */
    width: 33.8em;
    height: 22em;
  }
  @media (max-width: 23.438em) {
    /* position: sticky; */
    background-image: url("${(props) => props.src}");
    background-size: cover;
    background-position: center;
    /* width: 33.75em; */
    width: 22.438em;
    height: 22em;
  }

  @media (max-width: 47.938em) {
    /* position: sticky; */
    background-image: url("${(props) => props.src}");
    background-size: cover;
    background-position: center;
    /* width: 33.75em; */
    width: 23.7em;
    height: 22em;
  } ;
`;
export default Image;
