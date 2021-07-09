import React from "react";
import styled from "styled-components";

const RadioBtn = (props) => {
  const { type, id, text, checked, _onClick, _onChange, value } = props;
  return (
    <RadioContainer>
      <input
        type={type}
        id={id}
        checked={checked}
        onClick={_onClick}
        onChange={_onChange}
        value={value}
      />
      <label htmlFor={id}>{text}</label>
    </RadioContainer>
  );
};

RadioBtn.defaultProps = {
  type: false,
  id: false,
  text: false,
  checked: false,
  value: false,
  _onClick: () => {},
  _onChange: () => {},
};

const RadioContainer = styled.div`
  display: flex;
  /* justify-content: center; */
  font-size: 1em;
  font-weight: 500;
`;

export default RadioBtn;
