import React from 'react'
import { MdOutlinePushPin } from 'react-icons/md'
import { MdCreate, MdDelete } from 'react-icons/md'
import { CiUser } from "react-icons/ci";

import moment from "moment";


const NoteCard = ({ title, date, content, tags, isPined, isPinned, onDelete, onEdit, onPinNote,onUsers
}) => {
    return <>
        <div className='border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out'>
            <div className='flex items-center justify-between'>
                <div>
                    <h6 className='text-sm font-medium'>{title}</h6>
                    <span className='text-xs text-slate-500'>{moment(date).format('Do MM YYYY')}</span>
                </div>
                <MdOutlinePushPin className={`icon-btn ${isPined ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />
            </div>
            <p className='text-xs text-slate-600 mt-2'>{content?.slice(0, 60)}</p>

            <div className='flex items-center justify-between mt-2'>
                <div className='text-xs text-slate-500'>{tags.map((item) => `#${item}`)}</div>

                <div className='flex items-center gap-2'>

                    <CiUser className="icon-btn hover:text-green-600" onClick={()=>onUsers()} />

                    <MdCreate className="icon-btn hover:text-green-600" onClick={onEdit} />

                    <MdDelete className='icon-btn hover:text-red-600' onClick={onDelete} />
                </div>
            </div>
        </div>
    </>

}

export default NoteCard