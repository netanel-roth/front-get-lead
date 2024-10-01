import React, { useState } from 'react';
import { messages } from '../locales';
import ContinueButton from './components/ContinueButton';
import EmailInput from './components/EmailInput';
import PasswordInput from './components/PasswordInput';
import '../css/loginStyles.css'

const LoginPage: React.FC = () => {
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
        <div className='container'>
            <h1 className='header'>{messages.login.LOGIN_TITLE}</h1>
            <EmailInput value = {email} onChangeValue={handleEmailInputChange}/>
            <PasswordInput value = {password} onChangeValue={handlePasswordInputChange}/>
            <ContinueButton onLogin={onSubmitHandle}/>
        </div>
    );
};


export default LoginPage;

