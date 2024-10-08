import React, { useState, useEffect } from 'react';

// פונקציה שמנסה להחזיר מידע מה-localStorage (המקבילה ל-cache)
const getCache = (fileName: string): any | null => {
  const forceNewCache = new URLSearchParams(window.location.search).get('force_new_cache') === '1';

  if (forceNewCache) {
    return null;
  }

  const cacheData = localStorage.getItem(fileName);

  if (!cacheData) {
    return null;
  }

  try {
    const parsedData = JSON.parse(cacheData);
    const cacheTime = new Date(parsedData.timestamp);

    if (cacheTime > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)) {
      return parsedData.data;
    }
  } catch (e) {
    console.error('Error parsing cache data', e);
    return null;
  }

  return null;
};

// פונקציה לשמירת cache ב-localStorage
const setCache = (fileName: string, data: any): void => {
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(fileName, JSON.stringify(cacheData));
};

// פונקציה להוספת ערכים לקובץ cache מסוים
const loaderSet = (cacheName: string, value: any): void => {
  const cacheFileName = 'loaderValue';
  const cacheData = localStorage.getItem(cacheFileName);
  let parsedData = cacheData ? JSON.parse(cacheData) : {};

  parsedData[cacheName] = value;
  localStorage.setItem(cacheFileName, JSON.stringify(parsedData));
};

// פונקציה להחזרת ערך מקובץ cache מסוים
const loaderGet = (cacheName: string): any | null => {
  const forceNewCache = new URLSearchParams(window.location.search).get('force_new_cache') === '1';

  if (forceNewCache) {
    return null;
  }

  const cacheFileName = 'loaderValue';
  const cacheData = localStorage.getItem(cacheFileName);

  if (!cacheData) {
    return null;
  }

  const parsedData = JSON.parse(cacheData);

  if (parsedData[cacheName]) {
    return parsedData[cacheName];
  }

  return null;
};

// Custom Hook לניהול cache
const useCacheData = <T,>(cacheName: string, fetchFunction: () => Promise<T>): T | null => {
  const [data, setData] = useState<T | null>(null);
  const forceCache = new URLSearchParams(window.location.search).get('force_cache') === '1';

  useEffect(() => {
    const cacheData = getCache(cacheName);

    if (cacheData && !forceCache) {
      setData(cacheData);
    } else {
      fetchFunction().then(fetchedData => {
        setCache(cacheName, fetchedData);
        setData(fetchedData);
      });
    }
  }, [cacheName, fetchFunction, forceCache]);

  return data;
};

// קומפוננטה לדוגמה לטעינת מידע על שאלון
interface QuestionnaireDataProps {
  slug: string;
}

const QuestionnaireData: React.FC<QuestionnaireDataProps> = ({ slug }) => {
  const fetchQuestionnaireData = async (): Promise<any> => {
    const response = await fetch(`/api/questionnaires/${slug}`);
    return response.json();
  };

  const data = useCacheData(`questionnaire_${slug}_data`, fetchQuestionnaireData);

  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Questionnaire Data</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
};

export default QuestionnaireData;
