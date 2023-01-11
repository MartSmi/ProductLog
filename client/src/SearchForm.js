import React, { useState } from "react";
import { isEmptyString, isNullOrUndefined, titleFromName } from "./strings";
import "./form.css";

const Form = ({ onSubmitHandler }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        setIsSubmitting(true);
        const form = e.target;
        const newEntity = Object.values(form).reduce((obj, field) => {
          const { name } = field;

          if (!isEmptyString(name)) {
            obj[name] = field.value;
          }

          return obj;
        }, {});
        onSubmitHandler(newEntity);

        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <fieldset disabled={isSubmitting}>
        {<input id="searchPhrase" name="searchPhrase" type="text" />}
      </fieldset>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting" : "Submit"}
      </button>
    </form>
  );
};

export default Form;
