import {useState} from 'react'

class OrigamiAPI {
    private username: string | null = null;
    private password: string | null = null;
    private account: string | null = null;
    public forceWorkflowAsync: boolean = false;
  
    // הגדרת פרטי חיבור
    setConnection(details: { username: string; password: string; account: string }) {
      const { username, password, account } = details;
  
      if (!username || !password || !account) {
        return { error: 'Missing details' };
      }
  
      this.username = username;
      this.password = password;
      this.account = account;
    }
  
    // ביצוע קריאה ל-API
    async query(details: { module: string; action: string; data?: any; filesData?: any }): Promise<any> {
      const { module, action, data, filesData } = details;
  
      if (!module || !action || (!data && !filesData)) {
        return { error: 'Missing details' };
      }
  
      return this.execute(module, action, data, filesData);
    }
  
    // קריאת ה-API בפועל
    private async execute(module: string, action: string, data: any = null, filesData: any = null): Promise<any> {
      const url = `https://${this.account}.origami.ms/${module}/api/${action}/format/json?`;
      
      // יצירת פרטי החיבור
      let generalDetails: { [key: string]: string | boolean | null } = {
        username: this.username,
        password: this.password,
        with_token: '1',
      };
  
      // הוספת force_workflow_async אם נדרש
      if (this.forceWorkflowAsync) {
        generalDetails = {
          ...generalDetails,
          force_workflow_async: true,
        };
        this.forceWorkflowAsync = false;
      }
  
      let postData: any;
  
      if (filesData) {
        // Handling file data
        postData = new FormData();
        for (const [key, value] of Object.entries(filesData)) {
          postData.append(key, value);
        }
        for (const [key, value] of Object.entries(generalDetails)) {
          postData.append(key, value);
        }
      } else {
        postData = { ...generalDetails, ...data };
      }
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: filesData ? undefined : { 'Content-Type': 'application/json' },
          body: filesData ? postData : JSON.stringify(postData),
        });
  
        const result = await response.json();
  
        // טיפול בחריגה max_api_calls
        if (result.error && result.error.type === 'max_api_calls') {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 800));
          return this.execute(module, action, data, filesData); // ניסיון חוזר
        }
  
        return result;
      } catch (error) {
        console.error('Server error:', error);
      }
    }
  
    // קריאה בינארית לנתונים
    async executeBinary(path: string): Promise<any> {
      const url = path.includes(`://${this.account}.origami.ms`)
        ? path.replace('?', '/format/json?')
        : path;
  
      const generalDetails = {
        username: this.username,
        password: this.password,
      };
  
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(generalDetails as any),
        });
  
        const result = await response.json();
  
        // טיפול בחריגה max_api_calls
        if (result.error && result.error.type === 'max_api_calls') {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 800));
          return this.executeBinary(path); // ניסיון חוזר
        }
  
        return result;
      } catch (error) {
        console.error('Server error:', error);
        return null;
      }
    }
  }
  
  // קומפוננטה לדוגמה שמשתמשת ב-OrigamiAPI
  const OrigamiComponent: React.FC = () => {
    const origamiApi = new OrigamiAPI();
    const [response, setResponse] = useState<any>(null);
  
    const handleQuery = async () => {
      origamiApi.setConnection({
        username: 'your-username',
        password: 'your-password',
        account: 'your-account',
      });
  
      const result = await origamiApi.query({
        module: 'example-module',
        action: 'example-action',
        data: { key: 'value' },
      });
  
      setResponse(result);
    };
  
    return (
      <div>
        <button onClick={handleQuery}>Send API Request</button>
        {response && <pre>{JSON.stringify(response, null, 2)}</pre>}
      </div>
    );
  };
  
  export default OrigamiComponent;
  