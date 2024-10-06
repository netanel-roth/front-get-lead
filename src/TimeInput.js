import React from 'react';

const TimeInput = ({ value, onChange }) => {
    return (
        <textarea
            value={value}
            onChange={onChange}
            style={{
                width: '300px',
                height: '100px',
                borderRadius: '5px',
                padding: '10px',
                border: '1px solid #3D4873',
                marginTop: '20px'
            }}
        />
    );
};

export default TimeInput;
