import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar'
import NoteCard from '../Components/NoteCard'
import moment from "moment";
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../Utils/axiosinstance'
import Toast from '../Components/Toast';
import EmptyCard from '../Components/EmptyCard';
import AddNotesImg from '../assets/noteImg.svg'
import NoDataImg from '../assets/xyz.webp'
import UserModal from '../Components/UserModal';



Modal.setAppElement('#root')

const Home = () => {

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  })

  const [allNotes, setAllNotes] = useState([]);


  const [userInfo, setUserInfo] = useState(null);
  const [users, setUsers] = useState([]);

  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: "edit" })
  };

  const showToastMessage = (type, message) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  


  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  //Get user Info

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user)
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login")
      }
    }
  };

  const getAllUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-all-user");
      console.log("nitin",response.data.users);
      setUsers(response.data.users)
      // if (response && response.data && response.data.users) {
      //   setUsers(response.data.users)
      // }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login")
      }
    }
  };



  const openUserModal =  () => {
    const userList =  getAllUserInfo(); // Fetch or get user data
    console.log("fghjk",userList);
    
    setUsers(userList);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  //Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get('/get-all-notes')
      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (erroe) {
      console.log("An unexpected error occurred. please try again")
    }
  }

  //Delete Note

  const deleteNote = async (data) => {
    const noteId = data._id
    console.log("nocvhb", noteId);

    try {
      const response = await axiosInstance.delete('/delete-note/' + noteId);
      console.log("response", response);
      if (response && response.data) {
        showToastMessage("Note deleted Successfully", 'delete')
        getAllNotes()
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.type
      ) {
        console.log("An unexpected error occurred. please try again")
      }
    }
  };

  //Search note

  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-note", {
        params: { query },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateIsPinned = async (noteData) => {
    const noteId = noteData._id
    try {
      const response = await axiosInstance.put('/update-note/' + noteId, {
        "isPinned": !noteData.isPinned
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully")
        getAllNotes();
      }
    } catch (error) {
      console.log(error);

    }
  }

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  useEffect(() => {
    getAllNotes();
    getUserInfo();
    getAllUserInfo();
    return () => {
    }
  }, [])

  return (
    <>
      <Navbar
        userInfo={userInfo}
        onSearchNote={onSearchNote}
        handleClearSearch={handleClearSearch} />
      <div className='container mx-auto'>

        {allNotes.length > 0 ? (
          <div className='grid grid-cols-3 gap-4 mt-8'>
            {allNotes.map((item, index) => (
              <NoteCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                tags={item.tags}
                isPined={item.isPinned}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteNote(item)}
                onPinNote={() => updateIsPinned(item)}
                onUsers={()=>openUserModal()}
                />
            ))}


          </div>
        ) : (<EmptyCard
          imgSrc={isSearch ? NoDataImg : AddNotesImg}
          message={isSearch ? `Oops ! No note found matching your search.` : `Start creating your first note! Click the 'ADD' button to write
           down your Ideas ,thoghts  and Reminders. Let's get Started! `} />
        )}
      </div>

      <button className='w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 absolute right-10 bottom-10' onClick={() => {
        setOpenAddEditModal({ isShown: true, type: "add", data: null })
      }} >
        <MdAdd className='text-[32px] text-white' />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {
          setOpenAddEditModal({ isShown: false, type: "add", data: null })
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)"
          }
        }}
        contentLabel=""
        className='w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll' >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShown: false, type: "edit", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onclose={handleCloseToast} />

        {/* User Modal */}
      <UserModal isOpen={isUserModalOpen} onClose={()=>closeUserModal()} users={users} />
    </>
  )
}

export default Home;