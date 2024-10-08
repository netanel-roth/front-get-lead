import React, { useState } from 'react';

// פונקציה להחזרת רשימת תווים עבור Base32
const getBase32LookupTable = (): string[] => [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
  'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', '2', '3', '4', '5', '6', '7', '='
];

// פונקציה ליצירת secret
export const createSecret = (secretLength: number = 16): string => {
  const validChars = getBase32LookupTable();
  if (secretLength < 16 || secretLength > 128) {
    throw new Error('Bad secret length');
  }

  let secret = '';
  const rnd = new Uint8Array(secretLength);
  window.crypto.getRandomValues(rnd);

  for (let i = 0; i < secretLength; ++i) {
    secret += validChars[rnd[i] % 32];
  }

  return secret;
};

// פונקציה לחישוב ה-code מבוסס על הזמן וה-secret
export const getCode = async (secret: string, timeSlice: number | null = null): Promise<string> => {
  if (timeSlice === null) {
    timeSlice = Math.floor(Date.now() / 1000 / 30);
  }

  const secretKey = base32Decode(secret);
  const time = new Uint8Array(8);
  const timeView = new DataView(time.buffer);

  timeView.setUint32(4, timeSlice);

  // שימוש ב-await כדי להמתין לתוצאה של hash_hmac
  const hash = await window.crypto.subtle.digest('SHA-1', time);

  const hashView = new DataView(hash);
  const offset = hashView.getUint8(hash.byteLength - 1) & 0x0f;
  const binary = (
    ((hashView.getUint8(offset) & 0x7f) << 24) |
    ((hashView.getUint8(offset + 1) & 0xff) << 16) |
    ((hashView.getUint8(offset + 2) & 0xff) << 8) |
    (hashView.getUint8(offset + 3) & 0xff)
  );

  const code = binary % 10 ** 6;
  return code.toString().padStart(6, '0');
};

// פונקציה להמרת base32 ל-binary
const base32Decode = (secret: string): ArrayBuffer => {
  const lookupTable = getBase32LookupTable();
  const bytes: number[] = [];
  let buffer = 0;
  let bitsLeft = 0;

  for (let i = 0; i < secret.length; i++) {
    const val = lookupTable.indexOf(secret[i].toUpperCase());
    if (val === -1) continue;

    buffer = (buffer << 5) | val;
    bitsLeft += 5;

    if (bitsLeft >= 8) {
      bytes.push((buffer >> (bitsLeft - 8)) & 0xff);
      bitsLeft -= 8;
    }
  }

  return new Uint8Array(bytes).buffer;
};

// פונקציה לקבלת כתובת QR-Code מגוגל
export const getQRCodeGoogleUrl = (name: string, secret: string, title: string = '', params: { width?: number, height?: number, level?: string } = {}): string => {
  const width = params.width ?? 200;
  const height = params.height ?? 200;
  const level = params.level ?? 'M';

  let urlencoded = `otpauth://totp/${name}?secret=${secret}`;
  if (title) {
    urlencoded += `&issuer=${encodeURIComponent(title)}`;
  }

  return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(urlencoded)}&size=${width}x${height}&ecc=${level}`;
};

// פונקציה לבדיקת קוד מבוסס על secret
export const verifyCode = async (secret: string, code: string, discrepancy: number = 1, currentTimeSlice: number | null = null): Promise<boolean> => {
  if (currentTimeSlice === null) {
    currentTimeSlice = Math.floor(Date.now() / 1000 / 30);
  }

  if (code.length !== 6) {
    return false;
  }

  for (let i = -discrepancy; i <= discrepancy; i++) {
    const calculatedCode = await getCode(secret, currentTimeSlice + i);
    if (timingSafeEquals(calculatedCode, code)) {
      return true;
    }
  }

  return false;
};

// השוואת מחרוזות בצורה בטוחה מפני התקפות זמן
export const timingSafeEquals = (safeString: string, userString: string): boolean => {
  if (safeString.length !== userString.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < safeString.length; i++) {
    result |= safeString.charCodeAt(i) ^ userString.charCodeAt(i);
  }

  return result === 0;
};

// קומפוננטה לדוגמה לשימוש
const GoogleAuthenticatorComponent: React.FC = () => {
  const [secret, setSecret] = useState(createSecret());
  const [code, setCode] = useState('');

  const handleVerify = async () => {
    const isValid = await verifyCode(secret, code);
    alert(isValid ? 'Code is valid!' : 'Invalid code');
  };

  return (
    <div>
      <h1>Google Authenticator</h1>
      <p>Secret: {secret}</p>
      <img src={getQRCodeGoogleUrl('TestUser', secret, 'MyApp')} alt="QR Code" />
      
      <div>
        <label>Enter Code:</label>
        <input type="text" value={code} onChange={e => setCode(e.target.value)} />
        <button onClick={handleVerify}>Verify</button>
      </div>
    </div>
  );
};

export default GoogleAuthenticatorComponent;
