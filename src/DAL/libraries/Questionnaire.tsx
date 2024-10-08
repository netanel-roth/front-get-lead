import React, { useState, useEffect } from 'react';

// מגדירים ממשק לסוג המידע של tooltip
interface TooltipData {
  message_details: {
    message: string;
    reason_for_sending?: string; // שדה אופציונלי
  };
}

// מגדירים ממשק למידע של השאלות
interface QuestionData {
  id: string;
  title: string;
  stage?: {
    instance_id: string;
  };
  tooltip?: {
    instance_id: string;
    type: string;
  };
  type_of_question: string;
  questions_selections: Array<{
    question_selction_name: string;
    selction_message: {
      instance_id: string;
    };
  }>;
  date1_name: string;
  date2_name: string;
}

const QuestionnaireLibrary: React.FC = () => {
  // state לניהול המידע של tooltip
  const [tooltipData, setTooltipData] = useState<TooltipData | null>(null);
  // state לניהול המידע של השאלות
  const [questionData, setQuestionData] = useState<QuestionData | null>(null);

  // דומה ל'__construct' ב-PHP, useEffect פועל כשהקומפוננטה נטענת
  useEffect(() => {
    // כאן אנחנו "מדמים" בקשת API לטעינת המידע של tooltip
    fetchTooltipData();
  }, []);

  // פונקציה שמדמה הבאת נתונים מהשרת
  const fetchTooltipData = () => {
    // כאן יש להחליף את המידע הזה ב-API אמיתי שיביא את הנתונים הנכונים
    const mockTooltipData = {
      message_details: {
        message: 'דוגמה להודעת Tooltip',
        reason_for_sending: 'סיבה לדוגמה',
      },
    };
    setTooltipData(mockTooltipData);
  };

  // פונקציה שיוצרת HTML ל-tooltip על פי ID
  const getFinishedHtml = (tooltipId: string | undefined) => {
    if (!tooltipId || !tooltipData) return null; // בדיקה האם ה-id קיים והאם יש מידע על tooltip

    return (
      <div className="question_view-details">
        <div className="user-avatar text-center">
          <img src="/assets/images/avatar.png" alt="avatar" className="img-fluid" />
        </div>
        <div className="user_content_details">
          {/* הצגת הודעת tooltip */}
          <div className="description">{tooltipData.message_details.message}</div>
        </div>
      </div>
    );
  };

  // פונקציה המייצרת HTML עבור ה-tooltip
  const getTooltipHtml = (tooltipId: string, type: string) => {
    if (!tooltipId || !tooltipData) return null; // אם ה-tooltip ריק

    return (
      <div className={`question-answer_view_footer fade tooltip_content ${type === 'JUMP' ? '' : ''}`}>
        <a href="javascript:;" className="answer-user_close">
          <i className="fa-solid fa-circle-xmark"></i>
        </a>
        <div className="question-answer_user-detail">
          <div className="user-avatar">
            <img src="/assets/images/avatar.png" alt="avatar" className="img-fluid" />
          </div>
          <div className="user-title">
            <h3 className="user-name">עו״ד נתנאל רוט</h3>
          </div>
        </div>
        <div className="answer-user_content">
          {/* הצגת ההודעה מתוך tooltip */}
          <div className="description">{tooltipData.message_details.message}</div>
        </div>
      </div>
    );
  };

  // פונקציה שיוצרת את ה-HTML עבור שאלות
  const getQuestionHtml = (data: QuestionData | null, ans: string = '') => {
    if (!data) return null; // אם המידע של השאלה ריק, מחזירים כלום

    let stageTitle = '';
    if (data.stage?.instance_id) {
      // כאן יש לבצע לוגיקה להבאת הכותרת של השלב, לדוגמה:
      stageTitle = `Stage Title for ${data.stage.instance_id}`; // מחליפים לוגיקה אמיתית
    }

    return (
      <div data-step="" className="step">
        <div className="step-title_wrapper">
          {/* כותרת השלב */}
          <h2 className="title">{stageTitle}</h2>
        </div>
        <form className="question_form" id="question_form">
          {/* כאן אמור להיות קוד המציג את השאלה, תוכל להחליף בהתאם לצרכים שלך */}
          <div className="btn_continue">
            <input type="hidden" name="stage_id" id="stage_id" value={data.stage?.instance_id || ''} />
            <input type="hidden" name="question_id" id="question_id" value={data.id} />
            <button type="button" className="form-continue_btn btn btn-secondary rounded submit w-100">
              המשך
            </button>
          </div>
        </form>
      </div>
    );
  };

  return (
    <div>
      {/* דוגמאות לשימוש בפונקציות */}
      {getFinishedHtml(tooltipData?.message_details.message)}
      {getTooltipHtml('tooltipId', 'JUMP')}
      {getQuestionHtml(questionData, 'answer')}
    </div>
  );
};

export default QuestionnaireLibrary;
