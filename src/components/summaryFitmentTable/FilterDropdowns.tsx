import React from "react";
import Select from "react-select";
import { IFilter, ISelect } from "./helper";
import { SingleValue } from "react-select";

interface FilterDropdownsProps {
  label?: string;
  filter: IFilter;
  options: ISelect[];
  level: string;
  handleCategoryChange: (option: SingleValue<ISelect>, level: string) => void;
}

const FilterDropdowns: React.FC<FilterDropdownsProps> = ({
  label,
  filter,
  options,
  level,
  handleCategoryChange,
}) => {
  return (
    <div className="flex flex-col gap-2">
      <label className={`text-base text-[#1C1C1C] font-poppins`} htmlFor="city">
        {label || ""}
      </label>
      <div className={`relative w-[260px]`}>
        <Select
          value={filter[`${level}Level` as keyof IFilter] || options[0]}
          options={options}
          onChange={(option) => handleCategoryChange(option, level)}
        />
      </div>
    </div>
  );
};

export default FilterDropdowns;
