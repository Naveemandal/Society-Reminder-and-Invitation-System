import React, { useState } from 'react';
import Navbar from '../Components/Navbar';
import { Link, useNavigate } from 'react-router-dom';
import PasswordInput from '../Components/PasswordInput';
import { validateEmail } from '../Utils/helper';
import axiosInstance from '../Utils/axiosinstance';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    
    const handleLogin = async (e) => {
        e.preventDefault();

        if (!validateEmail(email)) {
            setError('Please enter a valid email address.');
            return ;
        }

        if (!password) {
            setError('Please enter a password.');
            return ;
        }

        setError ("")
  //Login API CALL
  setLoading(true);


        try {
            const response = await axiosInstance.post('/login', {
                email:email,
                password:password,
            });
// Handle successfull logi response
console.log("dfgh",response);

            if (response.data && response.data.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
                navigate('/dashboard');
            }else {
                localStorage.setItem('token', '');
                navigate('/login');
            }
           
        } catch (error) {
            //Hnadle error
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false); 
        }
    };


    return (
        <>
         
            <div className="flex items-center justify-center mt-28">
                <div className="w-96 border bg-white px-7 py-10">
                    <form onSubmit={handleLogin}>
                        <h4 className="text-2xl mb-7">Login</h4>

                        <input
                            type="text"
                            placeholder="Email"
                            className="input-box"
                            value={email}
                            onChange={(e)=>setEmail(e.target.value)}
                        />

                        <PasswordInput
                            value={password}
                            onChange={(e)=>setPassword(e.target.value)}

                        />

                        {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

                        <button
                         type="submit"
                          className="btn-primary"
                          disabled={loading} 
                        >
                        {loading ? 'logging in...' : 'login'}
                        </button>

                        <p className="text-sm text-center sm-4">
                            Not registered yet?{' '}
                            <Link to="/signUp" className="font-medium text-blue-600 underline">
                                Create an account
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Login;