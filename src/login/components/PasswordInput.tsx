import { Password } from 'primereact/password';
import { ChangeEvent, useState } from 'react';
import '../../css/loginStyles.css'


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
            placeholder='?מה הסיסמא שלך'
            toggleMask
            feedback={false}
        />
    )
}

export default PasswordInput;