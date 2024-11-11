import React, { useState } from 'react'
import { Profileinfo } from './Profileinfo'
import { Navigate, useNavigate } from 'react-router-dom'
import SearchBar from './SearchBar'

const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => {

  const [searchQuery, setSearchQuery] = useState("")

  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.clear()
    navigate("/login")
  };

  const handelSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery)
    }
  };
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch()
  };
  return (
    <>
      <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow'>
        <h2 className='text-xl font-medium text-black py-2'>Notes</h2>


        <SearchBar value={searchQuery}
          onChange={({ target }) => {
            setSearchQuery(target.value)
          }}
          handelSearch={handelSearch}
          onClearSearch={onClearSearch}
        />
        <Profileinfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </>
  )
}

export default Navbar;