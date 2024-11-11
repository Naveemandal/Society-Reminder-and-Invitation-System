import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import PasswordInput from '../Components/PasswordInput';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../Utils/helper';
import axiosInstance from '../Utils/axiosinstance'
import axios from 'axios';
import { Router , Routes , Route} from 'react-router-dom';


const SignUp = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please enter name");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    };
    if (!password) {
      setError("Please enter the password");
      return;
    }
    setError("");

    //SignUp API call
    try {
      const response = await axiosInstance.post('/creat-account', {
        fullName: name,
        email:email,
        password:password,
      });

      //Handle successful registration response
      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate('/login');  // Use navigate instead of Navigate
      }

    } catch (error) {
      // Handle login error
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className='flex items-center justify-center mt-28'>
        <div className='w-96 border bg-white px-7 py-10'>
          <form onSubmit={handleSignUp}>
            <h4 className='text-2xl mb-7'>SignUp</h4>

            <input type='text'
              placeholder='Name'
              className='input-box'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input type='text'
              placeholder='Email'
              className='input-box'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)} />

            {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}

            <button type='submit' className='btn-primary'>
              Create account
            </button>

            <p className='text-sm text-center sm-4'>
              Already have an account?{' '}
              <Link to='/Login' className='font-medium text-blue-600 underline '>
                Login
              </Link>
            </p>

          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
