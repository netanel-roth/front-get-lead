import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import { messages } from '../DAL/locales';
import ContinueButton from '../Components/Login/ContinueButton';
import EmailInput from '../Components/Login/EmailInput';
import PasswordInput from '../Components/Login/PasswordInput';
import '../globalCSS/login.css';
import { useAppDispatch, useAppSelector } from '../Redux/hooks';
import { loginUser } from '../Redux/authSlice';
import { LoginType } from '../types/loginTypes';
import PhoneInput from '../Components/Login/PhoneInput';
import axios from '../Axios/axios';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const currentURL = window.location.origin // כדי לא לבצע את הפונקציה הזאת יותר מפעם אחת היא הבסיס לקריאה לתמונות באתר
    const text = messages.login // במידת הצורך יאפשר שינוי פשוט למקור הטקסט באתר
    const [userData, setuserData] = useState({ email: '', phone: '', UserName: '', password: '' }); // כדי לשמור את פרטי היוזר
    const [loginType, setLoginType] = useState<LoginType>('Email'); // מאפשר החלפת מידע על המסך בהתאם לכתוב פה
    // מתחת לשורה זו יצרתי שני מחסני נתונים קטנים לצורך קריאה פשוטה יותר ושינוי קל יותר במידה ונצטרך להחליף שמות לאייקונים בתיקייה
    const blueIcons = { call: `${currentURL}/assets/phone-blue.svg`, SMS: `${currentURL}/assets/Icon-awesome-sms.svg`, Email: `${currentURL}/assets/mail-icon-blue.svg` }
    const whiteIcons = { call: `${currentURL}/assets/phone-icon.svg`, SMS: `${currentURL}/assets/SMS-icon-white.svg`, Email: `${currentURL}/assets/mail-icon.svg` }
    const [Icons, setIcons] = useState({ ...whiteIcons, Email: blueIcons.Email })
    const [errorM, seterrorM] = useState('')
    const dispatch = useAppDispatch();
    const { isLoading, redirectUrl } = useAppSelector((state) => state.auth); // קבלת ערכים מהסטייט המרכזי
    
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    const setUser = (e: React.ChangeEvent<HTMLInputElement>) => {
        const user: any = { ...userData }
        user[e.target.id] = e.target.value
        setuserData(user)
    }

    const handleSendPassword = async () => {
        if (userData.email || userData.phone) {
            try {
                //קוד שפונה לאוריגמי וגורם לשליחת קוד אימות למשתמש
                setShowPasswordInput(true);
                seterrorM('');
            } catch (error) {
                seterrorM(messages.Error.WRONG_INPUT);
            }
        } else {
            seterrorM(messages.Error.WRONG_INPUT);
        }
    };

    const handleLogin = async () => {
        if ((userData.email || userData.phone) && userData.password) {
            const identifier = loginType === 'Email' ? userData.email : userData.phone;
            
            try {
                const resultAction = await dispatch(
                    loginUser({
                        identifier: identifier,
                        identifierType: loginType,
                        password: userData.password
                    })
                );
    
                if (loginUser.fulfilled.match(resultAction)) {
                    const token = resultAction.payload.data.token; 
                    localStorage.setItem('token', token); 
                    seterrorM(''); 
                    navigate('/details'); 
                } else {
                    console.log('Login failed:', resultAction.payload);
                    seterrorM(messages.Error.WRONG_INPUT); 
                }
            } catch (error) {
                console.log('An error occurred:', error);
            }
        } else {
            seterrorM(messages.Error.WRONG_INPUT); 
        }
    };

    if (redirectUrl) {
        window.location.href = redirectUrl;
    }

    const clickType = (type: LoginType) => {
        setLoginType(type)
        const icons = { ...whiteIcons }
        icons[type] = blueIcons[type]
        setIcons(icons)
    }

    const offFocusType = (type: LoginType) => {
        if (loginType !== type) {
            const icons = { ...Icons }
            icons[type] = whiteIcons[type]
            setIcons(icons)
        }
    }

    const hover = (type: LoginType) => {
        if (loginType !== type) {
            const icons = { ...whiteIcons }
            icons[type] = blueIcons[type]
            icons[loginType] = blueIcons[loginType]
            setIcons(icons)
        }
    }

    return (
        <div className='container'>
            <div>
                <label>{text.CHOOSE_LOGIN_TYPE}</label>
                <p className='red'>{errorM}</p>
                <div className='loginTypes'>
                    <button id='call' className={`${loginType === 'call' ? 'choosen' : 'notChoosenB'} button-with-image`} onClick={() => clickType('call')} onMouseOver={() => hover('call')} onMouseOut={() => offFocusType('call')}>
                        <img src={Icons.call} alt='לוגו'></img>
                        <span>{text.PHONE}</span>
                    </button>
                    <button className={`${loginType === 'Email' ? 'choosen' : 'notChoosenB'} button-with-image`} onClick={() => clickType('Email')} onMouseOver={() => hover('Email')} onMouseOut={() => offFocusType('Email')}>
                        <img src={Icons.Email} alt='לוגו'></img>
                        <span>{text.TO_MAIL}</span>
                    </button>
                    <button className={`${loginType === 'SMS' ? 'choosen' : 'notChoosenB'} button-with-image`} onClick={() => clickType('SMS')} onMouseOver={() => hover('SMS')} onMouseOut={() => offFocusType('SMS')}>
                        <img src={Icons.SMS} alt='לוגו'></img>
                        <span>{text.TO_SMS}</span>
                    </button>
                </div>
            </div >
            {loginType === 'Email' ?
                <EmailInput value={userData.email} onChangeValue={setUser} /> :
                <PhoneInput value={userData.phone} onChangeValue={setUser} />
            }

            {!showPasswordInput ? (
                <ContinueButton onLogin={handleSendPassword} />
            ) : (
                <>
                    <PasswordInput value={userData.password} onChangeValue={setUser} />
                    <ContinueButton onLogin={handleLogin} />
                </>
            )}
        </div>
    );
};

export default LoginPage;
