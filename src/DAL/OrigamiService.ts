import axios from 'axios';

interface OrigamiServiceProps {
  username: string;
  password: string;
  account: string;
}

export class OrigamiService {
  private tokenTime = '+90 day';
  private tokenRemember = '+90 day';
  private addAuthAction = false;
  private username: string;
  private password: string;
  private account: string;

  constructor({ username, password, account }: OrigamiServiceProps) {
    this.username = username;
    this.password = password;
    this.account = account;
  }

  public async setConnection() {
    // Simulating setting connection in React
    return {
      username: this.username,
      password: this.password,
      account: this.account,
    };
  }

  public async switchForceWorkflowAsyncOn() {
    // This would typically set some workflow settings
    return true;
  }

  public async saveApiFile(apiPath: string, saveToPath: string) {
    try {
      const response = await axios.get(apiPath, { responseType: 'blob' });
      // Simulating saving the file locally
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', saveToPath);
      document.body.appendChild(link);
      link.click();
      link.remove();

      return { success: 'ok' };
    } catch (error) {
      return { error: 'Failed to save file', details: error };
    }
  }

  public normalizeFromApi(rs: any) {
    return {
      info: { total_count: 1 },
      data: [{ instance_data: rs[0] }],
    };
  }

  public generateToken(data: any, remember = false) {
    const tokenDate = remember
      ? Date.now() + parseInt(this.tokenRemember)
      : Date.now() + parseInt(this.tokenTime);
    const tokenKey = JSON.stringify([data, tokenDate, Math.random()]);
    return btoa(tokenKey); // Simple token generation using Base64 encoding
  }

  public checkToken(token: string) {
    const decodedToken = atob(token);
    const tokenData = JSON.parse(decodedToken);

    if (tokenData.length !== 3) return { error: 'Invalid token' };

    const currentTime = Date.now();
    if (tokenData[1] < currentTime) return { error: 'Token expired' };

    return { ok: tokenData[0] };
  }
}
