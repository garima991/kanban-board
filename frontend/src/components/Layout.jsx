import React from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import Column from './Column'
import Home from '../pages/Home'

const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
    {/* <Header /> */}
    <div className="flex flex-row flex-1 overflow-hidden">
      <Sidebar />
      <div className="overflow-x-auto overflow-y-auto flex-1 mt-4">
        <Home />
      </div>
    </div>
  </div>
  
  )
}

export default Layout;

