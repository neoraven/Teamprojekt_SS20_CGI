import axios from "axios";

var headers = ''
if (localStorage.getItem('token') != undefined){
  headers ={'Authorization': 'Token '.concat(localStorage.getItem('token'))}
}

export default axios.create({
  baseURL: "https://tubstp.englich.eu",
  headers: headers
  
});
