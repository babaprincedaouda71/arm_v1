import React from "react";

const RadioButton = ({ id, name, value, label, checked, onChange, className }) => {
    return (
        <div className="flex items-center space-x-6">
            <input
                id={id}
                type="radio"
                name={name}
                value={value}
                checked={checked}
                onChange={onChange}
                className={`text-primary accent-primary focus:ring-primary border-gray-300 ${className}`}
            />
            <label
                htmlFor={id}
                className="text-sm font-medium text-gray-700"
            >
                {label}
            </label>
        </div>
    );
};

export default RadioButton;
