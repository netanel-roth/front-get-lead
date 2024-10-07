import React, { useState, useEffect, ChangeEvent } from 'react';
import TimeButton from '../update-attendance/components/TimeButton';
import TimeInput from '../update-attendance/components/TimeInput';
import TimeTable from '../update-attendance/components/TimeTable';
import '../css/timer.css';
import '../css/App.css'
import { messages } from '../locales';
import { LogEntry } from '../types/updateAttendanceTypes';



const UpdateAttendancePage = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isClockRunning, setIsClockRunning] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [userInput, setUserInput] = useState('');
    const [inputError, setInputError] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const sendTimeToServer = async (time: Date, duration: number | null = null, userText = '') => {
        const dataToSend: LogEntry = {
            time: time.toLocaleTimeString(),
            date: time.toLocaleDateString(),
            duration: duration ? `${duration} שניות` : '',
            userText: userText,
        };

        console.log("שולח לשרת:", dataToSend);

        try {
            const response = await fetch('/api/logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSend),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const newLog: LogEntry = await response.json();
            setLogs(prevLogs => [...prevLogs, newLog]);
        } catch (error) {
            console.error("Error sending data to server:", error);
        }
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
        //     setIsClockRunning(false);
        //     const endTime: Date = new Date();
        //     const duration: number = Math.round((endTime.getTime() - (startTime?.getTime() || 0)) / 1000);
        //     sendTimeToServer(endTime, duration, userInput);

        //     setUserInput('');
        //     setShowInput(false);
    };

    const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setUserInput(e.target.value);
        if (e.target.value.length >= 10) {
            setInputError(false);
        }
    };

    return (
        <div className="container">
            <h1 className="title"></h1>

            {showInput && (
                <div className="input-container">
                    <div className={inputError ? 'input-error' : 'input-normal'}>
                        {messages.timer.ENTER_REPORT_MESSAGE}
                    </div>
                    <TimeInput value={userInput} onChange={handleInputChange} />
                </div>
            )}

            <TimeButton
                isClockRunning={isClockRunning}
                currentTime={currentTime}
                onClick={isClockRunning ? handleEndClick : handleStartClick}
            />

            <TimeTable />
        </div>
    );
};

export default UpdateAttendancePage;