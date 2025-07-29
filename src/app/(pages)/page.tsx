// import Image from "next/image";
import Navbar from '@/components/navbar/Navbar'
import Footer from '@/components/footer/Footer'
import LandingPage from './landingPage/page';

export default function Home() {
  return (
    <div className='w-full flex flex-col items-center'>
      <Navbar/>
      <LandingPage/>
      <Footer/>
    </div>
  );
}
