import { InputText } from 'primereact/inputtext';
import { ChangeEvent } from 'react';
import { messages } from '../../DAL/locales';
import { ChangeValueProps } from '../../types/loginTypes';


const PhoneInput = (props: ChangeValueProps) => {
    const { value, onChangeValue } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event)
    }
    return (
        <InputText 
            id="phone"
            className='input'
            type="email"
            value={value}
            onChange={handleChange}
            placeholder={messages.login.ENTER_PHONE}
        />
    )
}

export default PhoneInput;