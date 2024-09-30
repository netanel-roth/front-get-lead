import React, { ChangeEvent, useState } from 'react';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css'; // ניתן לשנות את הנושא בהתאם לרצונך
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { colors, messages } from '../locales';
import styles from '../css/styles';
import ContinueButton from './components/ContinueButton';
import EmailInput from './components/EmailInput';
import PasswordInput from './components/PasswordInput';

const ButtonRow: React.FC = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleEmailInputChange = (value:string) => {
        setEmail(value)
    }
    const handlePasswordInputChange = (value:string) => {
        setPassword(value)
    }
    const onSubmitHandle=()=>{
        // const token=axios.post('/login',{email,password});
        // localStorage.setItem('token',token)
        console.log('email:',email,'password: '+password)
    }
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>{messages.login.LOGIN_TITLE}</h1>
            <EmailInput value = {email} onChangeValue={handleEmailInputChange}/>
            <PasswordInput value = {password} onChangeValue={handlePasswordInputChange}/>
            <ContinueButton onLogin={onSubmitHandle}/>
        </div>
    );
};


export default ButtonRow;

