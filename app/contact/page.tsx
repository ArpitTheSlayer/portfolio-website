import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionLabel from "@/components/SectionLabel";
import ContactForm from "@/components/ContactForm";
import ContactPanel from "@/components/ContactPanel";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact Arpit Pandey — frontend developer in Raipur, India.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className="mx-auto w-full max-w-site px-6 py-16 md:px-10 md:py-20 lg:px-16"
      >
        <header className="max-w-3xl">
          <SectionLabel label="Contact" />
          <h1 className="mt-6 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-page">
            Let’s talk.
          </h1>
          <p className="mt-4 max-w-[620px] text-body-lg text-ink-soft">
            Have a project in mind, a question, or an exciting opportunity? Send
            me a message directly.
          </p>
        </header>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <ContactPanel />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
