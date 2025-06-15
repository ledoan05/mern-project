import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../Products/Sidebar'


const AdminLayout = () => {
  return (
    <div className='flex'>
      <AdminSidebar/>
      <Outlet/>
    </div>
  )
}

export default AdminLayout