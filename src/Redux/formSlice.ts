import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../Axios/axios';
import { RootState } from './store';
import { MessageType } from '../types/message';

// הגדרת הממשק (interface) למצב הטופס
interface FormState {
  personalData: {
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
    totalQuestions: number;
    questions: {
      accidentDate: string;
      accidentLocation: string;
      witnesses: string;
      vehicleDamage: string;
    };
  };
  injuryData: {
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

  messages: { sender: string; text: string }[];
  isLoading: boolean;
  error: string | null;
}

// המצב ההתחלתי (initial state)
const initialState: FormState = {
  personalData: {
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
    totalQuestions: 4,
    questions: {
      accidentDate: '',
      accidentLocation: '',
      witnesses: '',
      vehicleDamage: '',
    },
  },
  injuryData: {
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
  messages: [],
  isLoading: false,
  error: null,
};

// פעולה אסינכרונית לטעינת הנתונים מה-DB
export const fetchInitialData = createAsyncThunk(
  'form/fetchInitialData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/formData');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const addMessage = createAsyncThunk(
  'form/addMessage',
  async (message: MessageType, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/messages', { message });
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
    updatePersonalQuestion: (state:any, action: PayloadAction<{ question: string; answer: string }>) => {
      const { question, answer } = action.payload;
      state.personalData.questions[question] = answer;
      if (!state.personalData.completedQuestions.includes(question)) {
        state.personalData.completedQuestions.push(question);
      }
    },
    updateAccidentQuestion: (state:any, action: PayloadAction<{ question: string; answer: string }>) => {
      const { question, answer } = action.payload;
      state.accidentData.questions[question] = answer;
      if (!state.accidentData.completedQuestions.includes(question)) {
        state.accidentData.completedQuestions.push(question);
      }
    },
    updateInjuryQuestion: (state:any, action: PayloadAction<{ question: string; answer: string }>) => {
      const { question, answer } = action.payload;
      state.injuryData.questions[question] = answer;
      if (!state.injuryData.completedQuestions.includes(question)) {
        state.injuryData.completedQuestions.push(question);
      }
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(addMessage.fulfilled, (state, action: PayloadAction<MessageType>) => {
      state.messages.push(action.payload); // עדכון Redux עם ההודעה החדשה
    })
      // .addCase(sendMessage.pending, (state) => {
      //   state.isLoading = true;
      //   state.error = null;
      // })
      // .addCase(sendMessage.fulfilled, (state, action: PayloadAction<{ sender: string; text: string }>) => {
      //   state.isLoading = false;
      //   state.messages.push(action.payload);
      // })
      // .addCase(sendMessage.rejected, (state, action: PayloadAction<any>) => {
      //   state.isLoading = false;
      //   state.error = action.payload.message;
      // });
  },
});

// בורר לבחירת הודעות והשלמה
export const selectMessages = (state: RootState) => state.form.messages;
export const selectPersonalData = (state: RootState) => state.form.personalData;
export const selectAccidentData = (state: RootState) => state.form.accidentData;
export const selectInjuryData = (state: RootState) => state.form.injuryData;


// ייצוא הפעולות והרידוסר
export const { updatePersonalQuestion, updateAccidentQuestion, updateInjuryQuestion } = formSlice.actions;
export default formSlice.reducer;
