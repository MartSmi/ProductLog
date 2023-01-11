import React, { useEffect, useRef } from "react";

const Input = ({id, value = "", type = "text", readOnly = false, required = false}) => {
    const input = useRef(null);

    useEffect(() => {
        if (input.current) {
            const sValue = value.toString();

            if (type === 'checkbox') {
                input.current.checked = sValue === (input.current.value = 'true')
            } else {
                input.current.value = sValue
            }
        }
    }, [type, value])

    return (
        <input
            ref={input}
            id={id}
            name={id}
            type={type}
            readOnly={readOnly}
            disabled={readOnly}
            required={required}
        />
    );
};

export default Input;
