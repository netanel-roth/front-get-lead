import React, { useState } from 'react';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // ניתן לשנות את הנושא בהתאם לרצונך
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { colors, messages } from '../locales';

const ButtonRow: React.FC = () => {
    const [email,setEmail]=useState('')
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>{messages.login.LOGIN_TITLE}</h1>
            <Button id = "username"label={messages.login.LOGIN_WITH_EMAIL_TITLE} className="p-button-rounded" style={styles.button} />
            <InputText type = "email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='?מה המייל שלך'/>
            <Button label="המשך" className="p-button" style={styles.continueButton} />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '1rem',
        backgroundColor:colors.BLUE_COLOR
    },
    header: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color:colors.ORANGE_COLOR
    },
    button: {
        backgroundColor: colors.WHITE_COLOR,
        color: colors.BLUE_COLOR,
        border: '1px solid #CCCCCC',
        height: '100px', // גובה קבוע לכפתור ריבועי
        width: '200px', // רוחב קבוע לכפתור ריבועי
        marginTop:'60px'
    },
    input: {
        padding: '0.5rem',
        fontSize: '1rem',
        borderRadius: '5px',
        border: '1px solid #CCCCCC',
        width: '250px',
        marginTop:'60px'
    },
    continueButton: {
        backgroundColor: colors.ORANGE_COLOR,
        color: colors.WHITE_COLOR,
        padding: '0.5rem 1rem',
    },
};

// Media Queries for responsiveness
const responsiveStyles = {
    '@media (max-width: 768px)': {
        header: {
            fontSize: '2.5rem',
        },
        button: {
            height: '80px',
            width: '80px',
        },
        input: {
            width: '200px',
        },
    },
    '@media (max-width: 480px)': {
        header: {
            fontSize: '2rem',
        },
        button: {
            height: '60px',
            width: '60px',
        },
        input: {
            width: '150px',
        },
    },
};



export default ButtonRow;

