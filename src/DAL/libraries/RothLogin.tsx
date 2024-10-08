import React, { useState } from 'react';

interface LoginProps {
  email?: string;
  phone?: string;
  loginType: 'email' | 'phone' | 'call';
}

const RothLogin: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [otp, setOtp] = useState<string | null>(null);

  const emailLogin = async (post: LoginProps) => {
    if (!post.email) {
      setMessage("Email is required.");
      return false;
    }

    const getUser = await findUserByEmail(post.email);
    if (!getUser) {
      setMessage("User not found.");
      return { status: 'error', message: "User not found" };
    }

    // Assume getUser contains user details
    const contactId = getUser.id;
    let leadId = '';

    if (!getUser.lawsuitFile) {
      const leadData = await findLead(contactId);
      if (!leadData) {
        setMessage("Cases not found.");
        return { status: 'error', message: "Cases not found or not linked" };
      }

      leadId = leadData.id;
      setSessionData('questionnaire_slug', leadData.questionnaireSlug || '');
      setSessionData('redirect', 'question');
    } else {
      setSessionData('redirect', 'dashboard');
    }

    setSessionData('contact_id', contactId);
    setSessionData('lead_id', leadId);

    const isEmailSent = await sendOtpToEmail(getUser);
    if (isEmailSent.success) {
      setSessionData('type', post.loginType);
      setOtp(isEmailSent.otp);
      setMessage(`OTP successfully sent to ${post.email}`);
      return { status: 'success', message: `OTP sent to ${post.email}`, otp: isEmailSent.otp };
    }

    return isEmailSent;
  };

  const phoneLogin = async (post: LoginProps) => {
    if (!post.phone) {
      setMessage("Phone number is required.");
      return false;
    }

    const getUser = await findUserByPhone(post.phone);
    if (!getUser) {
      setMessage("User not found.");
      return { status: 'error', message: "User not found" };
    }

    // Similar logic as emailLogin...
  };

  return (
    <div>
      <h2>Login</h2>
      <p>{message}</p>
      {otp && <p>Your OTP is: {otp}</p>}
    </div>
  );
};

export default RothLogin;

// Helper functions (mock implementations)
const findUserByEmail = async (email: string) => {
  // Replace with actual API call
  return { id: '1', lawsuitFile: null };
};

const findLead = async (contactId: string) => {
  // Replace with actual API call
  return { id: 'lead1', questionnaireSlug: 'slug' };
};

const setSessionData = (key: string, value: string) => {
  sessionStorage.setItem(key, value);
};

const sendOtpToEmail = async (user: any) => {
  // Replace with actual OTP logic
  return { success: true, otp: '1234' };
};

const findUserByPhone = async (phone: string) => {
  // Replace with actual API call
  return { id: '1', lawsuitFile: null };
};
