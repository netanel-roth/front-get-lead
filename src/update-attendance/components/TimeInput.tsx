import React from 'react';
import '../../css/timer.css'; 

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
