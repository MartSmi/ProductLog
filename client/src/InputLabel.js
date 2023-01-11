import React from "react";
import Input from "./Input";

const InputLabel = ({label, error, info, ...inputProps}) => {
    return (
        <p
            className="input-label"
        >
            <label htmlFor={inputProps.id}>
                {
                    label
                }
            </label>
            <Input
                {...inputProps}
            />
        </p>
    );
};

export default InputLabel;
