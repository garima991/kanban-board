import React from 'react'
import { useSelector } from 'react-redux';
import Column from '../components/Column';
import Header from '../components/Header';

const Home = () => {
    const boards = useSelector((state) => state.kanban);
    const board = boards.find((board) => board.isActive === true);
    const columns = board.columns;

    return (

        <div className='w-full flex flex-row justify-between gap-4 p-2'>
            <div className="w-full fixed top-0 left-auto right-0 bg-white z-10">
                <Header />
            </div>
        <div className='mt-14 flex flex-row gap-4 w-full'>
            {columns.map((col, index) => (
                <Column key={index} colIndex={index} />
            ))}
            </div>
        </div>
    )
}

export default Home
