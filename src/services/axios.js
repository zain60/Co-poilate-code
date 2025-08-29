import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/", // Replace with your API URL
  // baseURL: "http://ec2-35-93-96-51.us-west-2.compute.amazonaws.com:5000/api", // QA server
  // baseURL: "https://inj-be.easystepin.io/api/", // QA server with domiain
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
