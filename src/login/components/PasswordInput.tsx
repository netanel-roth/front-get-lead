import { Password } from 'primereact/password';
import { ChangeEvent, useState } from 'react';
import styles from '../../css/styles';


const PasswordInput = (props: ChangeValueProps) => {
    const { value, onChangeValue } = props;
    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event.target.value)
    }

    return (
        <Password 
            style={styles.input}
            value={value}
            onChange={handleChange}
            placeholder='?מה הסיסמא שלך'
            toggleMask
            feedback={false}
        />
    )
}

export default PasswordInput;