import React from 'react';
// import LoginIcon from '@mui/icons-material/Login';
// import LogoutIcon from '@mui/icons-material/Logout';
import { ButtonAttendanceProps } from '../../types/updateAttendanceTypes';

const TimeButton = (props: ButtonAttendanceProps) => {
    const { isClockRunning, currentTime, onClick } = props;
    
    return (
        <button className="time-button c-white-color bg-orange-color" onClick={onClick}>
            {/* {isClockRunning ? (
                <LogoutIcon className="icon" />
            ) : (
                <LoginIcon className="icon" />
            )} */}
            <div className="text-container">
                <span className="main-text c-white-color">
                    {isClockRunning ? 'דווח שעת יציאה' : 'דווח שעת כניסה'}
                </span>
                <div className="date-time c-white-color">
                    <span className="time">{currentTime.toLocaleTimeString()}</span>
                    <span className="separator">|</span>
                    <span className="c-white-color">{currentTime.toLocaleDateString()}</span>
                </div>
            </div>
        </button>
    );
};

export default TimeButton;