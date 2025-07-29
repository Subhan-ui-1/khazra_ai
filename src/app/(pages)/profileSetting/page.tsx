'use client';
import React from 'react'
import Image from 'next/image';
import { MdEdit } from 'react-icons/md';
import Sidebar from '@/components/sideBar/SideBar';
import AccountSetting from '../_components/accountSettings/AccountSettings'

const userData = {
    firstName: 'Jhon',
    lastName: 'Doe',
    email: 'Khazraabc123@gmail.com',
    phone: '(123) 456 789 012',
    company: 'Khazra Carbons',
    position: 'Admin Manger',
    employees: '20',
    industry: 'Fabric Manufacturing',
};

const page = () => {
    return (
        <div className='flex h-full'>   
            <Sidebar/>  
            <AccountSetting />
        </div>
    )
}

export default page
