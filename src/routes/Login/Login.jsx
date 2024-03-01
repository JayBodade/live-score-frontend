import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
    const [formData, setFormData] = useState({ adminemail: '', adminpassword: '' });

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
     
        event.preventDefault();
        const apiUrl = import.meta.env.VITE_REACT_APP_API_URL;
       const response = await fetch(`${apiUrl}/adminlogin`,{
        method:"POST",
        headers:{
            'content-type':'application/json',
        },
        body:JSON.stringify(formData)
       })
       

       const json = await response.json();

       if(json.success){
           localStorage.setItem('token',json.token);
           navigate('/admin')
       }else{
            toast.error(json.message);
       }
      };
    
    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      };

  return (<>
  <ToastContainer/>
    <div className="min-h-screen flex items-center  justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div className="max-w-md w-full space-y-8">
      <div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome Admin, Please Login
        </h2>
      </div>
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div className="rounded-md shadow-sm -space-y-px">
          <div>
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="adminemail"
              type="email"
              autoComplete="email"
              required
              value={formData.adminemail}
              onChange={handleChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <input
              id="password"
              name="adminpassword"
              type="password"
              autoComplete="current-password"
              required
              value={formData.adminpassword}
              onChange={handleChange}
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Password"
            />
          </div>
        </div>

       

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log in
          </button>
        </div>
      </form>
    </div>
  </div>
  </>
  );
};

export default LoginForm;

