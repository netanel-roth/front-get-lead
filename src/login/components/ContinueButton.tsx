import { Button } from 'primereact/button';
import '../../css/login.css';
import '../../css/App.css';
import { OnLoginProps } from '../../types/loginTypes';


const ContinueButton = (props:OnLoginProps) => {
    const {onLogin}=props;
    const handleClick=(event:React.MouseEvent)=>{
        onLogin();
    }
    return (
        <Button label="המשך" className="continue-button bg-orange-color c-white-color" onClick={handleClick}/>
    )
}

export default ContinueButton;