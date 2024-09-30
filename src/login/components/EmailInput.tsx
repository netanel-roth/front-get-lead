import { InputText } from 'primereact/inputtext';
import { ChangeEvent } from 'react';
import styles from '../../css/styles';


const EmailInput = (props: ChangeValueProps) => {
    const { value, onChangeValue } = props;

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        onChangeValue(event.target.value)
    }
    return (
        <InputText 
            style={styles.input}
            type="email"
            value={value}
            onChange={handleChange}
            placeholder='?מה המייל שלך'
        />
    )
}

export default EmailInput;