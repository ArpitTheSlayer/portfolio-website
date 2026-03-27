import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import { Projects } from '@/context/Context'
import Image from "next/image"
import Link from "next/link"

const page = () => {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-4 my-8">
        {Projects.map((project, index) => (
          <div key={index} className="p-4 rounded-2xl outline-2 outline-tia-maria-950 dark:outline-tia-maria-50">
            <Image src={project.src} alt={project.alt} className="w-full mb-4 rounded-lg" />
            <h1 className="font-bold text-2xl">{project.name}</h1>
            <p>{project.description}</p>
            <div className="flex my-4 gap-2 flex-wrap">
              <Link href={project.github} target="_blank" className="bg-[#A6DF2A] hover:bg-[#82B11B] transition-all text-tia-maria-950 px-6 py-2 rounded-sm cursor-pointer mr-4">
                GitHub Repository
              </Link>
              {project.liveLink &&
                <Link href={project.liveLink} target="_blank" className="bg-[#DE2124] hover:bg-[#B11B1D] transition-all text-tia-maria-50 px-6 py-2 rounded-sm cursor-pointer">
                  View Project
                </Link>
              }
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </div>
  )
}

export default page