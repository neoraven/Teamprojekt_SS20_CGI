import axios from "axios";

var headers = ''
if (localStorage.getItem('token') != undefined){
  headers ={'Authorization': 'Token '.concat(localStorage.getItem('token'))}
}

export default axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: headers
  
});