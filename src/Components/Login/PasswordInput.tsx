import { InputText } from 'primereact/inputtext';
import { ChangeEvent, useState } from 'react';
import { ChangeValueProps } from '../../types/loginTypes'; 
import 'primeicons/primeicons.css'; 
import {messages} from '../../DAL/locales'

const PasswordInput = (props: ChangeValueProps) => {
    const { value, onChangeValue } = props; 
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); 

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event); 
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible); 
    };

    return (
        <div className="password-input-wrapper">
            <InputText
                id="password"
                type={isPasswordVisible ? 'text' : 'password'}
                value={value}
                onChange={handleChange}
                placeholder={messages.login.ENTER_PASSWORD}
                className="password-input"
            />
            <i
                className={`password-icon ${isPasswordVisible ? 'pi pi-eye-slash' : 'pi pi-eye'}`}
                onClick={togglePasswordVisibility}
            />
        </div>
    );
};

export default PasswordInput;
