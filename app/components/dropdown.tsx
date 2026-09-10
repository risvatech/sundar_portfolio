// components/Dropdown.tsx
import React from "react";

export interface DropdownOption {
    value: string;
    label: string;
}

export interface DropdownProps {
    label?: string;
    name: string;
    options: DropdownOption[];
    value: string;
    onChange: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
                                               label,
                                               name,
                                               options,
                                               value,
                                               onChange
                                           }) => {
    return (
        <div>
            {label && (
                <label
                    htmlFor={name}
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    {label}
                </label>
            )}

            <select
                id={name}
                name={name}
                className="text-gray-900 border border-gray-300 rounded-md p-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                <option value="">Select...</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Dropdown;