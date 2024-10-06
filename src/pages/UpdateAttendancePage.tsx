import React, { useState, useEffect, ChangeEvent } from 'react';
import TimeButton from '../update-attendance/components/TimeButton';
import TimeInput from '../update-attendance/components/TimeInput';
import { DataToSendType } from '../types/updateAttendanceTypes'


const UpdateAttendancePage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState<Date>(new Date());
    const [isClockRunning, setIsClockRunning] = useState<boolean>(false);
    const [showInput, setShowInput] = useState<boolean>(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [userInput, setUserInput] = useState<string>('');
    const [inputError, setInputError] = useState<boolean>(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const sendTimeToServer = (time: Date, duration?: number | null, userText: string = '') => {
        const dataToSend: DataToSendType = {
            time: time.toLocaleTimeString(),
            date: time.toLocaleDateString(),
        };

        if (duration) {
            dataToSend.duration = duration;
        }

        if (userText) {
            dataToSend.userText = userText;
        }

        console.log("שולח לשרת:", dataToSend);
    };

    const handleStartClick = () => {
        setIsClockRunning(true);
        setStartTime(currentTime);
        sendTimeToServer(currentTime);
        setShowInput(true);
        setInputError(false);
    };

    const handleEndClick = () => {
        if (userInput.length < 10) {
            setInputError(true);
            return;
        }

        setIsClockRunning(false);
        sendTimeToServer(currentTime, null, userInput);

        if (startTime) {
            const duration = Math.round((currentTime.getTime() - startTime.getTime()) / 1000);
            sendTimeToServer(currentTime, duration, userInput);
        }

        setUserInput('');
        setShowInput(false);
    };

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(event.target.value);
        if (event.target.value.length >= 10) {
            setInputError(false);
        }
    };

    return (
        <div
            style={{
                backgroundColor: '#3D4873',
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingTop: '50px'
            }}
        >
            <h1 style={{ color: 'white', marginBottom: '20px' }}>דווח שעות עבודה</h1>
            {showInput && (
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <div
                        style={{
                            color: 'white',
                            marginBottom: '10px',
                            border: inputError ? '2px solid red' : 'none',
                            padding: inputError ? '5px' : '0'
                        }}
                    >
                        אנא הכנס לפחות 10 תווים המסבירים מה ביצעת היום
                    </div>
                    <TimeInput value={userInput} onChange={handleInputChange} />
                </div>
            )}

            <TimeButton
                isClockRunning={isClockRunning}
                currentTime={currentTime}
                onClick={isClockRunning ? handleEndClick : handleStartClick}
            />
        </div>
    );
};


export default UpdateAttendancePage;


