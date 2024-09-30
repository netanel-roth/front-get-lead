import { colors } from "../locales";

const styles = {
    container: {
        gap: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: '100px',
    },
    header: {
        fontSize: '3rem',
        color: colors.WHITE_COLOR,
    },
    continueButton: {
        backgroundColor: colors.ORANGE_COLOR,
        color: colors.WHITE_COLOR,
        padding: '0.5rem 1rem',
        width: '70%',
        minWidth: '150px', 
        maxWidth: '600px',
        marginTop: '4%',
        height: '50px', 
        border: '1px solid #CCCCCC',
        borderRadius: '17px',
        TextAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '20% !important', 
        minWidth: '200px !important',
        maxWidth: '400px !important', 
    },
    '@media (max-width: 768px)': {
        input: {
            width: '80% !important', 
        },
        continueButton: {
            width: '30% !important', 
            height: '40px', 
        },
    },
};

export default styles;