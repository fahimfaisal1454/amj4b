// src/Pages/Home/Home.jsx
import Banner from "../../Components/Banner/Banner";
import ImpactStats from "../../Components/ImpactStats/ImpactStats";
import ProgramsGrid from "../ProgramsGrid/ProgramsGrid";
import StoriesStrip from "../StoriesStrip/StoriesStrip";
import NewsSection from "../NewsSection/NewsSection";
import AboutUs from "../AboutUs/AboutUs";
import Contact from "../Contact/Contact";

export default function Home() {
  return (
    <div className="bg-black text-white scroll-smooth">
      {/* HERO / HOME */}
      <section id="home" className="scroll-mt-28 md:scroll-mt-32">
        <Banner />
      </section>

      {/* ABOUT (new component) */}
      <AboutUs />

      {/* PROJECTS / PROGRAMS */}
      <section id="projects" className="scroll-mt-28 md:scroll-mt-32">
        <ProgramsGrid />
      </section>

      {/* IMPACT */}
      <section id="impact" className="scroll-mt-28 md:scroll-mt-32">
        <ImpactStats />
      </section>

      {/* STORIES */}
      <section id="stories" className="scroll-mt-28 md:scroll-mt-32">
        <StoriesStrip />
      </section>

      {/* NEWS (let the component own its section/id to avoid duplicates) */}
      <NewsSection />

      {/* CONTACT */}
     <Contact/>
      
    </div>
  );
}
