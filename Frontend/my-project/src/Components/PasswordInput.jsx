import React, { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const PasswordInput = ({ value, onChange, placeholder }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className='flex items-center border-[1.5px] border-gray-300 rounded px-4 py-2 mb-3 bg-white'>
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? 'text' : 'password'}
        placeholder={placeholder || 'Password'}
        className='w-full text-sm bg-transparent py-2 rounded outline-none'
      />
       {isShowPassword ? (
        <FaRegEye 
        size={22}
        className='text-sky-500 cursor-pointer'
        onClick={()=>toggleShowPassword()} />

       ) :( <FaRegEyeSlash
        size={22}
        className='text-slate-400 cursor-pointer'
        onClick={()=>toggleShowPassword()} />
       )
        }
    
    
    </div>
  );
};

export default PasswordInput;
