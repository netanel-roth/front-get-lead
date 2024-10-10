import { useState } from 'react';
import './table.css';
import 'primeicons/primeicons.css';
import { AttendanceType, TimeTableProps } from '../../types/updateAttendanceTypes';
import { messages } from '../../DAL/locales';
import { TabView, TabPanel } from 'primereact/tabview';

const TimeTable = (props: TimeTableProps) => {
    const { attendances } = props;
    const [activeTab, setActiveTab] = useState('today');

    const filterAttendances = () => {
        const now = new Date();
        const today = now.toLocaleDateString();
        const lastWeek = new Date(now.setDate(now.getDate() - 7));
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        return attendances.filter(att => {
            const attendanceDate = new Date(att.attendanceDate);
            switch (activeTab) {
                case 'today':
                    return attendanceDate.toLocaleDateString() === today;
                case 'week':
                    return attendanceDate >= lastWeek;
                case 'month':
                    return attendanceDate >= firstDayOfMonth;
                default:
                    return false;
            }
        });
    };

    const filteredAttendances = filterAttendances();

    return (
        <div className="time-table-container">
            <TabView activeIndex={['today', 'week', 'month'].indexOf(activeTab)} onTabChange={(e) => setActiveTab(['today', 'week', 'month'][e.index])}>
                <TabPanel header="היום">
                    <AttendanceList attendances={filteredAttendances} />
                </TabPanel>
                <TabPanel header="שבוע">
                    <AttendanceList attendances={filteredAttendances} />
                </TabPanel>
                <TabPanel header="חודש">
                    <AttendanceList attendances={filteredAttendances} />
                </TabPanel>
            </TabView>
        </div>
    );
};

const AttendanceList = ({ attendances }: { attendances: AttendanceType[] }) => (
    <div className="logs-container">
        {attendances.length > 0 ? (
            <ul>
                {attendances.map((att, index) => (
                    <li key={index}>
                        {`${new Date(att.attendanceDate).toLocaleDateString()} - ${att.checkInTime} עד ${att.checkOutTime}, סה"כ שעות: ${att.overallTime}`}
                    </li>
                ))}
            </ul>
        ) : (
            <div>{messages.timer.NO_REPORTS_FOR_DISPLAY}</div>
        )}
    </div>
);

export default TimeTable;
