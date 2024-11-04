import axios from '../Axios/axios'

export const addMessage = async (message:string) => {
    //const response = await fetch('https://localhost:7169/api/Product')
    const response = await axios.post('/Message',message)

    // לקריאת get & delete אין body
    // const response = await fetch('https://jsonplaceholder.typicode.com/todos', { method: 'POST', body: JSON.stringify({}) })
    // const products = await response.json()
    console.log("add messasge");
    console.log(response); 
    return response.data
}
