import BookAppointment from "@/components/BookAppointment";
import ServicesContainer from "@/components/ServicesContainer";
import HeroSection from "@/components/HeroSection";
import Technologies from "@/components/Technologies";
import AboutUs from "@/components/AboutUs";
import { Cookiesbanner } from "@/components/Cookiesbanner";

export default function Home() {
  return (
    <main className="animate-fadeIn bg-white">
      <Cookiesbanner />

      <HeroSection />
      <div id="about-us" className="scroll-mt-10 bg-white">
        <AboutUs />
      </div>
      <div id="technologies" className="scroll-mt-10 bg-[#97a6af]">
        <Technologies />
      </div>

      <div id="services" className="scroll-mt-10">
        <ServicesContainer />
      </div>

      <div className="scroll-mt-10" id="booking-section">
        <BookAppointment />
      </div>
    </main>
  );
}
