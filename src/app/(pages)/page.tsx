// import Image from "next/image";
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import LandingPage from './landingPage/page';
import { redirect } from 'next/navigation';

export default function Home() {
  redirect('/login')
  return (
    <div className='w-full flex flex-col items-center'>
      <Navbar/>
      <LandingPage/>
      <Footer/>
    </div>
  );
}
