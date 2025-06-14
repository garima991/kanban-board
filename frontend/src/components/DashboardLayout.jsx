import React from 'react'
import Sidebar from './Sidebar'
import { BoardModalProvider } from '../contexts/BoardModalContext'
import Dashboard from '../pages/Dashboard'

const DashboardLayout = () => {
  return (
    <div className="flex flex-col h-screen">
    <div className="flex flex-row flex-1 overflow-hidden">
      <BoardModalProvider>
        <Sidebar />
      </BoardModalProvider>
      <div className="overflow-y-auto flex-1">
        <Dashboard />
      </div>
    </div>
  </div>
  
  )
}

export default DashboardLayout;

