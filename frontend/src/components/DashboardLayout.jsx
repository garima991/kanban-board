import React from 'react'
import Sidebar from './Sidebar'
import { BoardModalProvider } from '../contexts/BoardModalContext'
import Kanban from '../pages/Kanban'
import Dashboard from '../pages/Dashboard'
import { Outlet } from 'react-router'

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen">
    {/* <Header /> */}
    <div className="flex flex-row flex-1 overflow-hidden">
      <BoardModalProvider>
        <Sidebar />
      </BoardModalProvider>
      <div className="overflow-x-auto overflow-y-auto flex-1 mt-4">
        <Dashboard />
      </div>
    </div>
  </div>
  
  )
}

export default DashboardLayout;

