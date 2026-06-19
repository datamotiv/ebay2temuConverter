import React, { ChangeEvent } from "react";

type TInputProps = {
  value?: string; // Use 'value' instead of 'controlValue'
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
  id?: string;
  name?: string;
  
};

const Input: React.FC<TInputProps> = ({
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  id = "",
  name = "text",
}) => {
  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value} // Controlled component with 'value'
      onChange={onChangeHandler}
      placeholder={placeholder}
      // className={`rounded-lg border bg-white bg-opacity-10 outline-none ${className}`}
      className={`bg-transparent border-b-2 border-gray-400 focus:border-blue-500 focus:ring-0 outline-none p-2 ${className}`}
    />
  );
};

export default Input;
