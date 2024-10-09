import { InputText } from 'primereact/inputtext';
import { ChangeEvent } from 'react';
import { messages } from '../../DAL/locales';
import { ChangeValueProps } from '../../types/loginTypes';


const EmailInput = (props: ChangeValueProps) => {
    const { value, onChangeValue } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event)
    }
    return (
        <InputText 
            id="email"
            className='input'
            type="email"
            value={value}
            onChange={handleChange}
            placeholder={messages.login.ENTER_EMAIL}
        />
    )
}

export default EmailInput;