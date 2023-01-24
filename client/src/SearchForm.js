import React, { useState } from "react";
import { isEmptyString, isNullOrUndefined, titleFromName } from "./strings";
import "./form.css";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const SearchForm = ({
  searchPhrase,
  handleChange,
  handleSubmit,
  isSubmitting,
  setIsSubmitting,
}) => {
  return (
    <Box
      component="form"
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
        m: "2rem auto 0 auto",
        display: "flex",
      }}
      id="form"
      noValidate
      autoComplete="off"
      onSubmit={(e) => {
        if (!isEmptyString(searchPhrase)) {
          setIsSubmitting(true);
          handleSubmit();
        }
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <TextField
        disabled={isSubmitting}
        id="searchPhrase"
        name="searchPhrase"
        type="text"
        value={searchPhrase}
        onChange={handleChange}
        label="Phrase"
        variant="outlined"
      />
      <Button variant="contained" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting" : "Submit"}
      </Button>
    </Box>
  );
};

export default SearchForm;
