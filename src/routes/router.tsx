import { Navigate, createBrowserRouter } from 'react-router-dom'
import paths from './paths'
import ButtonRow from '../pages/LoginPage'


export const router = createBrowserRouter(
    [
        {
            path: '',
            element: <Navigate to={paths.LOGIN} />
        },
        {
            path: paths.LOGIN,
            element: <ButtonRow />
        }
    ]
)