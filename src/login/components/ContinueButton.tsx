import { Button } from 'primereact/button';
import '../../css/loginStyles.css'
import { OnLoginProps } from '../../types/loginTypes';


const ContinueButton = (props:OnLoginProps) => {
    const {onLogin}=props;
    const handleClick=(event:React.MouseEvent)=>{
        onLogin();
    }
    return (
        <Button label="המשך" className="continue-button" onClick={handleClick}/>
    )
}

export default ContinueButton;