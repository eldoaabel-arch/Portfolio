import Navbar from "@/components/Navbar";
import Main from "@/components/Main";
import Work from "@/components/Work";
import Services from "@/components/Services";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Engineering from "@/components/Engineering";

export default function Home() {
  return (
    <>
      <Navbar />
      <Main />
      <Work />
      <Engineering />
      <Services />
      <About />
      <Contact />
    </>
  );
}