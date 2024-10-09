import React from 'react';
import "./globalCSS/App.css"
import { Route, Routes } from 'react-router-dom';
import NavBar from './Components/globalComppnents/NavBar/NavBar';
import Login from './pages/LoginPage';
import { useAppSelector } from './Redux/hooks';
import Home from './pages/Home';
import UpdateAttendancePage from './pages/UpdateAttendancePage';



const App: React.FC = () => {
  const auth = useAppSelector((state) => state.auth);
  
  return (
    <section>
      <header>
        <NavBar />
      </header>
      <main className='App itemscenter'>
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/Login" Component={Login} />
          <Route path="/details" Component={UpdateAttendancePage} />
          {/* <Route path="/Lead" Component={Lead}>
            <Route path=":pupils-accidents" Component={Pupil} />
            <Route path=":car-accidents" Component={Car} />
            <Route path=":get-Medical" Component={UploadForm} />
          </Route>
          {auth.isLoggedIn ?
            <Route path="/details" Component={UpdateAttendancePage} /> :
            <Route path="/Login" Component={Login} />
          } */}
        </Routes>
      </main>
    </section>
  );
};

export default App;
