import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

const selectmenuoptions = [
  { title: "Bacterial", category: "Panel" },
  { title: "Viral", category: "Panel" },
  { title: "Streptococcus pneumoniae", category: "Bacteria" },
  { title: "Moraxella Catarrhalis", category: "Bacteria" }, 
  { title: "Haemophilus Influenzae", category: "Bacteria" },
  { title: "Influenza", category: "Virus" },
  { title: "Sars-Cov-2", category: "Virus" }
];

const SelectMenu = ({grabOption}) => {
  const options = selectmenuoptions.map((option) => {
    const category = option.category;
    return {
      category,
      ...option
    };
  });  
  
  return (
    <Autocomplete
      id="query option" 
      multiple 
      onChange={(event,data) => grabOption(data)}
      options={options.sort((a, b) => -b.category.localeCompare(a.category))}
      getOptionDisabled={(option) => option.category === "Bacteria" || option.category === "Virus"}
      groupBy={(option) => option.category}
      getOptionLabel={(option) => option.title}
      sx={{ width: 300 }}
      renderInput={(params) => <TextField {...params} label="Query Option" />}
    />
  );
};

// console.log(selectmenuoptions);
export default SelectMenu;