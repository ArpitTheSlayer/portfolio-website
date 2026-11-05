import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectsList from "@/components/ProjectsList";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected projects by Arpit Pandey: commercial Next.js platforms, full-stack applications and responsive UI builds.",
};

export default function ProjectsPage() {
  return (
    <>
      <Navbar />
      <main
        id="main"
        className="mx-auto w-full max-w-site px-6 py-16 md:px-10 md:py-20 lg:px-16"
      >
        <ProjectsList />
      </main>
      <Footer />
    </>
  );
}
