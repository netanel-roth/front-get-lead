import { InputText } from 'primereact/inputtext';
import { ChangeEvent } from 'react';
import '../../css/login.css'
import { messages } from '../../locales';
import { ChangeValueProps } from '../../types/loginTypes';


const EmailInput = (props: ChangeValueProps) => {
    const { value, onChangeValue } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event.target.value)
    }
    return (
        <InputText 
            className='input'
            type="email"
            value={value}
            onChange={handleChange}
            placeholder={messages.login.ENTER_EMAIL}
        />
    )
}

export default EmailInput;