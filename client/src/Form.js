import React, {useState} from 'react';
import InputLabel from "./InputLabel";
import {isEmptyString, isNullOrUndefined, titleFromName} from "./strings";
import './form.css'

const Form = ({entity, onSubmitHandler, onDeleteHandler}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  return (
    <form onSubmit={e => {
      setIsSubmitting(true);
      const form = e.target;
      const newEntity = Object.values(form).reduce((obj, field) => {
        const {name} = field;

        if (!isEmptyString(name)) {
          switch (typeof entity[name]) {
            case "number":
              obj[name] = field.valueAsNumber;
              break;
            case "boolean":
              obj[name] = field.value === 'true';
              break;
            default:
              obj[name] = field.value
          }
        }

        return obj
    }, {})
      onSubmitHandler(newEntity);

      e.stopPropagation();
      e.preventDefault()
    }}>
      <fieldset
        disabled={isSubmitting}
      >
      {
        Object.entries(entity).map(([entityKey, entityValue]) => {
          if (entityKey === "id") {
            return <input
              type="hidden"
              name="id"
              key="id"
              value={entityValue}
            />
          } else {
            return <InputLabel
              id={entityKey}
              key={entityKey}
              label={titleFromName(entityKey)}
              type={
                typeof entityValue === "boolean"
                  ? "checkbox"
                  : "text"
              }
              value={entityValue}
            />
          }
        })
      }
      </fieldset>
      <button
        type="submit"
        disabled={isSubmitting}
      >
        {
          isSubmitting ? 'Submitting' : 'Submit'
        }
      </button>
      {
        onDeleteHandler && !isNullOrUndefined(entity.id) && <button
          disabled={isSubmitting}
          onClick={() => {
            setIsSubmitting(true);
            onDeleteHandler(entity.id)
          }}
        >
          Delete
        </button>
      }
    </form>
  );
};

export default Form;
