import React from 'react';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

const TimeButton = ({ isClockRunning, currentTime, onClick }) => {
    return (
        <button
            onClick={onClick}
            style={{
                backgroundColor: '#F5A777', 
                color: 'white', 
                width: '320px', 
                height: '100px', 
                border: 'none',
                borderRadius: '5px',
                display: 'flex',
                alignItems: 'center', 
                justifyContent: 'center', 
                fontSize: '16px',
            }}
        >
            {isClockRunning ? (
                <LogoutIcon style={{ color: 'white', marginRight: '80px' }} />
            ) : (
                <LoginIcon style={{ color: 'white', marginRight: '80px' }} />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
                    {isClockRunning ? 'דווח שעת יציאה' : 'דווח שעת  כניסה'}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', color: 'white' }}>
                    <span style={{ fontWeight: 'bold' }}>{currentTime.toLocaleTimeString()}</span>
                    <span style={{ marginLeft: '5px', marginRight: '5px' }}>|</span>
                    <span>{currentTime.toLocaleDateString()}</span>
                </div>
            </div>
        </button>
    );
};

export default TimeButton;