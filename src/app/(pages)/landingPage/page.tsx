
import Hero from '@/app/(pages)/_components/hero/Hero'
import Partners from '@/app/(pages)/_components/partners/Partners'
import MeasurementSection from '@/app/(pages)/_components/measurements/Measurements';
import ReductionSection from '@/app/(pages)/_components/reduction/Reduction'
import ComplianceSection from '@/app/(pages)/_components/compliance/Compliance';
import Companies from '../_components/companies/Companies';
import TrustedCompliance from '../_components/trustedCompliance/TrustedCompliance';
import Testimonial from '../_components/testimonial/Testimonial';

export default function LandingPage() {
    return (
        <div className='w-full flex flex-col items-center'>
            <Hero/>
            <Partners/>
            <MeasurementSection/>
            <ReductionSection />
            <ComplianceSection/>
            <Companies/>
            <TrustedCompliance/>
            <Testimonial/>
        </div>
    );
}
