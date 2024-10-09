import { useState, useEffect } from 'react';
import './table.css';
import 'primeicons/primeicons.css';
import { LogEntry, MonthlyTimeData } from '../../types/updateAttendanceTypes';
import { messages } from '../../DAL/locales';
import { TabView, TabPanel } from 'primereact/tabview'; 

const TimeTable = () => {
    const log: LogEntry = { time: '02:00', date: '08.02.24', duration: '7', userText: 'cccc' };
    const logs: LogEntry[] = [log];

    const [activeTab, setActiveTab] = useState('today');
    const [monthlyTimeData, setMonthlyTimeData] = useState<MonthlyTimeData[]>([]);

    const fetchMonthlyDuration = async () => {
        const response = await fetch('/api/monthly-duration');
        const data = await response.json();
        setMonthlyTimeData(data);
    };

    useEffect(() => {
        if (activeTab === 'month') {
            fetchMonthlyDuration();
        }
    }, [activeTab]);

    const filterLogs = () => {
        const today = new Date().toLocaleString();
        const lastWeek = new Date();
        lastWeek.setDate(lastWeek.getDate() - 7);
        const lastMonth = new Date();
        lastMonth.setDate(1);

        switch (activeTab) {
            case 'today':
                return logs.filter(log => log.date === today);
            case 'week':
                return logs.filter(log => {
                    const logDate = new Date(log.date);
                    return logDate >= lastWeek && logDate <= new Date();
                });
            case 'month':
                return logs.filter(log => {
                    const logDate = new Date(log.date);
                    return logDate >= lastMonth && logDate <= new Date();
                });
            default:
                return logs;
        }
    };

    const filteredLogs = filterLogs();

    return (
        <div className="time-table-container">
            <TabView activeIndex={['today', 'week', 'month'].indexOf(activeTab)} onTabChange={(e) => setActiveTab(['today', 'week', 'month'][e.index])}>
                <TabPanel header="היום">
                    <div className="logs-container">
                        {filteredLogs.length > 0 ? (
                            <ul>
                                {filteredLogs.map((log, index) => (
                                    <li key={index}>{messages.timer.DONE_ACTIVITY_MESSAGE}</li>
                                ))}
                            </ul>
                        ) : (
                            <div>{messages.timer.NO_REPORTS_FOR_DISPLAY}</div>
                        )}
                    </div>
                </TabPanel>
                <TabPanel header="שבוע">
                    <div className="logs-container">
                        {filteredLogs.length > 0 ? (
                            <ul>
                                {filteredLogs.map((log, index) => (
                                    <li key={index}>{messages.timer.DONE_ACTIVITY_MESSAGE}</li>
                                ))}
                            </ul>
                        ) : (
                            <div>{messages.timer.NO_REPORTS_FOR_DISPLAY}</div>
                        )}
                    </div>
                </TabPanel>
                <TabPanel header="חודש">
                    <div className="logs-container">
                        {monthlyTimeData.length > 0 ? (
                            <ul>
                                {monthlyTimeData.map((entry, index) => (
                                    <li key={index}>
                                        {entry.date} - {entry.duration} שניות
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div>{messages.timer.NO_DATA_FOR_MONTH}</div>
                        )}
                    </div>
                </TabPanel>
            </TabView>
        </div>
    );
};

export default TimeTable
