import { Button } from 'primereact/button';
import styles from '../../css/styles';


const ContinueButton = (props:OnLoginProps) => {
    const {onLogin}=props;
    const handleClick=(event:React.MouseEvent)=>{
        onLogin();
    }
    return (
        <Button label="המשך" className="p-button" style={styles.continueButton} onClick={handleClick}/>
    )
}

export default ContinueButton;