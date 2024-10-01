import { Navigate, createBrowserRouter } from 'react-router-dom'
import paths from './paths'
import LoginPage from '../login/LoginPage'


export const router = createBrowserRouter(
    [
        {
            path: '',
            element: <Navigate to={paths.LOGIN} />
        },
        {
            path: paths.LOGIN,
            element: <LoginPage />
        }
    ]
)