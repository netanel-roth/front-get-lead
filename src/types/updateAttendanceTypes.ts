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
    duration?: number | null;
    userText?: string;
}
