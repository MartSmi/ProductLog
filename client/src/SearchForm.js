import React, { useState } from "react";
import { isEmptyString, isNullOrUndefined, titleFromName } from "./strings";
import "./form.css";

const Form = ({
  searchPhrase,
  handleChange,
  handleSubmit,
  isSubmitting,
  setIsSubmitting,
}) => {
  return (
    <form
      onSubmit={(e) => {
        if (!isEmptyString(searchPhrase)) {
          setIsSubmitting(true);
          handleSubmit();
        }
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      {
        <input
          disabled={isSubmitting}
          id="searchPhrase"
          name="searchPhrase"
          type="text"
          value={searchPhrase}
          onChange={handleChange}
        />
      }
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting" : "Submit"}
      </button>
    </form>
  );
};

export default Form;
