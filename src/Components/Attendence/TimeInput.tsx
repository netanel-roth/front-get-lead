import React from 'react';

interface TimeInputProps {
    value: string;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
}

const TimeInput: React.FC<TimeInputProps> = ({ value, onChange }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            className="textarea" 
        />
    );
};

export default TimeInput;
