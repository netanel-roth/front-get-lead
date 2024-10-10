import React, { useState, useEffect, ChangeEvent } from 'react';
import TimeButton from '../Components/Attendence/TimeButton';
import TimeInput from '../Components/Attendence/TimeInput';
import TimeTable from '../Components/Attendence/TimeTable';
import '../Components/Attendence/timer.css';
import { messages } from '../DAL/locales';
import { AttendanceType, LogEntry } from '../types/updateAttendanceTypes';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { useDispatch } from 'react-redux';
import { addAttendance, fetchAttendance } from '../Redux/attendanceSlice';
import { selectUser } from '../Redux/authSlice';
import { UserType } from '../types/loginTypes';



const UpdateAttendancePage: React.FC = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isClockRunning, setIsClockRunning] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [userInput, setUserInput] = useState('');
    const [inputError, setInputError] = useState(false);
    const { attendances, isLoading, error } = useAppSelector((state) => state.attendance);
    const user: UserType | null = useAppSelector(selectUser);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        dispatch(fetchAttendance(user?.id));
    }, [dispatch, user?.id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const handleStartClick = () => {
        setIsClockRunning(true);
        setStartTime(currentTime);
        setShowInput(true);
        setInputError(false);
    };

    const handleEndClick = () => {
        if (userInput.length < 10) {
            setInputError(true);
            return;
        }
        //קריאה לשליחה לנסט
        sendAttendanceToNestServer()
        setIsClockRunning(false);
        setUserInput('');
        setShowInput(false);
    };
    const sendAttendanceToNestServer = async () => {
        if (!startTime || userInput.length < 10) {
            setInputError(true);
            return;
        }

        const endTime: Date = new Date();
        const duration: number = Math.round((endTime.getTime() - (startTime.getTime())) / 1000);

        try {
            const newAttendance: AttendanceType = {
                userId: user?.id,
                attendanceDate: new Date(Date.UTC(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate())).toISOString().split('T')[0],
                checkInTime: startTime.toLocaleTimeString(),
                checkOutTime: endTime.toLocaleTimeString(),
                overallTime: duration / 3600,
                userNote: userInput
            };
            await dispatch(addAttendance(newAttendance));

        } catch (error) {
            console.error("Error adding attendance:", error);
        }
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

            <TimeTable attendances={attendances} />
        </div>
    );
};

export default UpdateAttendancePage;