import { ChangeEvent } from 'react'

export type ButtonAttendanceProps = {
    isClockRunning: true | false,
    currentTime: Date,
    onClick: () => void
}

export type InputAttendanceProps = {
    value: string,
    onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
}

export type DataToSendType = {
    time: string;
    date: string;
    duration?: string | null;
    userText?: string;
};

export type LogEntry = {
    time: string;
    date: string;
    duration: string;
    userText: string;
};

export type MonthlyTimeData = {
    date: string;   
    duration: number | string; 
}

export type AttendanceType = {
    id?: number;
    userId: number|undefined;
    attendanceDate: string; 
    checkInTime: string;  
    checkOutTime: string; 
    overallTime: number; 
    userNote:string;
  };

  export type TimeTableProps = {
    attendances: AttendanceType[];
};