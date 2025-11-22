import AboutSentence from "@/components/home/aboutSentence";
import Footer from "@/components/home/footer";
import IntroSentence from "@/components/home/introSentence";
import ServiceSentence from "@/components/home/serviceSentence";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({ component: App });

function App() {
  return (
    <div>
      <IntroSentence />
      <AboutSentence />
      <ServiceSentence />
      <Footer />
    </div>
  );
}
