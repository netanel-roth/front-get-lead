import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../Axios/axios';
import { RootState } from './redux/store';

// הגדרת הממשק (interface) למצב הטופס
interface FormState {
  personalData: {
    completedQuestions: string[];
    totalQuestions: number;
    questions: {
      name: string;
      age: string;
      address: string;
      maritalStatus: string;
      occupation: string;
    };
  };
  accidentData: {
    completedQuestions: string[];
    totalQuestions: number;
    questions: {
      accidentDate: string;
      accidentLocation: string;
      witnesses: string;
      vehicleDamage: string;
    };
  };
  injuryData: {
    completedQuestions: string[];
    totalQuestions: number;
    questions: {
      injuryType: string;
      affectedBodyPart: string;
      initialMedicalVisit: string;
      medicalDiagnosis: string;
      ongoingSymptoms: string;
      treatmentPlan: string;
    };
  };
  completionPercentage: {
    personal: number;
    accident: number;
    injury: number;
  };
  messages: { sender: string; text: string }[];
  isLoading: boolean;
  error: string | null;
}

// המצב ההתחלתי (initial state)
const initialState: FormState = {
  personalData: {
    completedQuestions: [],
    totalQuestions: 5,
    questions: {
      name: '',
      age: '',
      address: '',
      maritalStatus: '',
      occupation: '',
    },
  },
  accidentData: {
    completedQuestions: [],
    totalQuestions: 4,
    questions: {
      accidentDate: '',
      accidentLocation: '',
      witnesses: '',
      vehicleDamage: '',
    },
  },
  injuryData: {
    completedQuestions: [],
    totalQuestions: 6,
    questions: {
      injuryType: '',
      affectedBodyPart: '',
      initialMedicalVisit: '',
      medicalDiagnosis: '',
      ongoingSymptoms: '',
      treatmentPlan: '',
    },
  },
  completionPercentage: {
    personal: 0,
    accident: 0,
    injury: 0,
  },
  messages: [],
  isLoading: false,
  error: null,
};

// Async thunk לשליחת הודעה לשרת
export const sendMessage = createAsyncThunk(
  'form/sendMessage',
  async ({ sender, text }: { sender: string; text: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/messages', { sender, text });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// יצירת Slice לניהול מצב הטופס
const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    updatePersonalQuestion: (state, action: PayloadAction<{ question: string; answer: string }>) => {
      const { question, answer } = action.payload;
      state.personalData.questions[question] = answer;
      if (!state.personalData.completedQuestions.includes(question)) {
        state.personalData.completedQuestions.push(question);
      }
    },
    updateAccidentQuestion: (state, action: PayloadAction<{ question: string; answer: string }>) => {
      const { question, answer } = action.payload;
      state.accidentData.questions[question] = answer;
      if (!state.accidentData.completedQuestions.includes(question)) {
        state.accidentData.completedQuestions.push(question);
      }
    },
    updateInjuryQuestion: (state, action: PayloadAction<{ question: string; answer: string }>) => {
      const { question, answer } = action.payload;
      state.injuryData.questions[question] = answer;
      if (!state.injuryData.completedQuestions.includes(question)) {
        state.injuryData.completedQuestions.push(question);
      }
    },
    updateCompletionPercentage: (state) => {
      state.completionPercentage.personal =
        (state.personalData.completedQuestions.length / state.personalData.totalQuestions) * 100;
      state.completionPercentage.accident =
        (state.accidentData.completedQuestions.length / state.accidentData.totalQuestions) * 100;
      state.completionPercentage.injury =
        (state.injuryData.completedQuestions.length / state.injuryData.totalQuestions) * 100;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action: PayloadAction<{ sender: string; text: string }>) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.error = action.payload.message;
      });
  },
});

// בורר לבחירת הודעות והשלמה
export const selectMessages = (state: RootState) => state.form.messages;
export const selectCompletionPercentage = (state: RootState) => state.form.completionPercentage;

// ייצוא הפעולות והרידוסר
export const { updatePersonalQuestion, updateAccidentQuestion, updateInjuryQuestion, updateCompletionPercentage } = formSlice.actions;
export default formSlice.reducer;
