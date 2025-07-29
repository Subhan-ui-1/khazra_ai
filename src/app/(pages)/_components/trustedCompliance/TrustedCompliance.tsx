import React from 'react'
import HorizontalMarquee from '../horizontalScroll/HorizontalScroll'
import { icons } from "@/components/icons/icons";

const brandsTwo = [
    { svg: icons.Spotify, alttext: "gri.svg" },
    { svg: icons.B27, alttext: "27B" },
    { svg: icons.LinkTree, alttext: "LinkTree" },
    { svg: icons.AKQA, alttext: "AKQA" },
    { svg: icons.Ogilvy, alttext: "Ogilvy" },
    { svg: icons.Webflow, alttext: "Webflow" },
    { svg: icons.TBWA, alttext: "TBWA" },
    { svg: icons.SBTi, alttext: "SBTi" },
    { svg: icons.TCFD, alttext: "TCFD" },
]


const TrustedCompliance = () => {
    return (
        <div className='border-b-2 border-dashed w-full md:py-[60px] sm:py-[40px] py-[30px]' style={{backgroundColor: '#E6EBE9'}}>
            <div className='max-w-[1440px] w-full mx-auto'>
                <div className='px-5 w-full flex flex-col items-center justify-center' >
                    <div className='max-w-[1040px] w-full flex flex-col justify-center items-center'>
                        <button className='py-3 px-6 rounded-full mb-10 w-[166px] cursor-default hover:scale-105 duration-200 transition ease-in-out' style={{backgroundColor: 'var(--Outline)', color: 'var(--Heading)', fontSize: 'var(--P1-size)'}}>Compliance</button>
                        <div className='text-center space-y-4'>
                            <h3 style={{fontSize: 'var(--H3-size)', fontWeight: 'var(--H3-weight)'}}>Trusted Solution for Global Compliance Standards.</h3>
                            <p style={{fontSize: 'var(--P1-size)', color: 'var(--Paragraph)'}}>The reports issued by Khazra.ai comply with the requirements of the world's most recognised standards.</p>
                        </div>
                    </div>
                </div>
                <div className='mt-10 w-full overflow-hidden '>
                    <HorizontalMarquee brands={brandsTwo} bgColor="var(--Placeholder)" textColor="var(--Heading)" />
                </div>
            </div>
        </div>
    )
}

export default TrustedCompliance
