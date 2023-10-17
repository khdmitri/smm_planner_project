import './globals.css';
import Banner from './landing/components/Banner';
import Companies from './landing/components/Companies/Companies';
import Courses from './landing/components/Courses';
import Mentor from './landing/components/Mentor';
import Newsletter from './landing/components/Newsletter/Newsletter';
import Navbar from "@/app/landing/components/Navbar";
import Footer from "@/app/landing/components/Footer/Footer";


export default function Home() {
    return (
        <>
            <Navbar/>
            <main>
                <Banner/>
                <Companies/>
                <Courses/>
                <Mentor/>
                {/*<Testimonials />*/}
                <Newsletter/>
            </main>
            <Footer/>
        </>
    )
}
