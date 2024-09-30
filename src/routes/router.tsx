import { Navigate, createBrowserRouter } from 'react-router-dom'
import paths from './paths'
import ButtonRow from '../pages/LoginPage'
import TimeLogger from '../TimeLogger'


export const router = createBrowserRouter(
    [
        {
            path: '',
            element: <Navigate to={paths.TIMER} />
        },
        {
            path: paths.TIMER,
            element: <TimeLogger />
        }
    ]
)