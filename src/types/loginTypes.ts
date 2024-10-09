export type ChangeValueProps = {
    value:string
    onChangeValue: (e:React.ChangeEvent<HTMLInputElement>) => void;
}

export type OnLoginProps={
    onLogin:() => void;
}

export type LoginType = 'Email' | 'SMS' | 'call'; // שפת טייפסקריפט דורשת הגדרת טייפים ולכן הגדרתי את טייפ דרכי הכניסה