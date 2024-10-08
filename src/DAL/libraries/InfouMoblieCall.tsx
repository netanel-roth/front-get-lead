import React, { useState } from 'react';

// פונקציה ליצירת קוד OTP רנדומלי
const generateOTP = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // קוד רנדומלי בן 4 ספרות
};

// קומפוננטה לשליחת הודעת קול
const VoiceMessage: React.FC = () => {
  const [number, setNumber] = useState<string>(''); // מספר טלפון
  const [custId, setCustId] = useState<string>(''); // מזהה לקוח
  const [response, setResponse] = useState<any>(null); // תגובת ה-API

  const sendVoiceMessage = async () => {
    const otp = generateOTP(); // יצירת קוד OTP

    const url = process.env.REACT_APP_INFOUMOBILE_VOICE_API as string; // URL ה-API
    const username = process.env.REACT_APP_INFOUMOBILE_USERNAME as string; // שם המשתמש
    const password = process.env.REACT_APP_INFOUMOBILE_PASSWORD as string; // הסיסמה

    const request = {
      Data: {
        List: [
          {
            IgnorePossibleSendingTime: false,
            Language: 'en-male',
            CallerId: 'private',
            TextToSpeech: `Hello world your one time password is ${otp}`,
            Phone: number,
            CustomerMessageID: custId,
          },
        ],
      },
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          Authorization: 'Basic ' + btoa(`${username}:${password}`), // מבצע אימות בסיסי
        },
        body: JSON.stringify(request),
      });

      const result = await response.json();
      setResponse(result); // שמירת התוצאה
      console.log(result);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <h1>Send Voice Message</h1>
      <input
        type="text"
        placeholder="Enter phone number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter customer ID"
        value={custId}
        onChange={(e) => setCustId(e.target.value)}
      />
      <button onClick={sendVoiceMessage}>Send Voice Message</button>

      {response && (
        <div>
          <h2>API Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default VoiceMessage;
