import BookAppointment from "@/components/BookAppointment";
import ServicesContainer from "@/components/ServicesContainer";
import HeroSection from "@/components/HeroSection";
import Technologies from "@/components/Technologies";
import { Cookiesbanner } from "@/components/Cookiebanner";


export default function Home() {
  return (
    <main className="fadeIn animate-fadeIn bg-white">
      <Cookiesbanner />

      <HeroSection />
      <div id="technologies" className="scroll-mt-10 bg-[#b0c0ca]">
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
