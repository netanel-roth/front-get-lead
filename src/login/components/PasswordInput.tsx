import { Password } from 'primereact/password';
import { ChangeEvent } from 'react';
import '../../css/loginStyles.css'
import { messages } from '../../locales';
import { ChangeValueProps } from '../../types/loginTypes';


const PasswordInput = (props: ChangeValueProps) => {
    const { value, onChangeValue } = props;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event.target.value)
    }

    return (
        <Password
            className='input'
            value={value}
            onChange={handleChange}
            placeholder={messages.login.ENTER_PASSWORD}
            toggleMask
            feedback={false}
        />
    )
}

export default PasswordInput;