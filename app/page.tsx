import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import profilePic from "@/assets/images/profile-pic.png";
import htmlIcon from "@/assets/svg/HTML5.svg";
import cssIcon from "@/assets/svg/CSS3.svg";
import javascriptIcon from "@/assets/svg/JavaScript.svg";
import nodejsIcon from "@/assets/svg/Node-js.svg";
import reactIcon from "@/assets/svg/React.svg";
import expressIcon from "@/assets/svg/Express.svg";
import mongodbIcon from "@/assets/svg/MongoDB.svg";
import tailwindcssIcon from "@/assets/svg/Tailwind-CSS.svg";
import reduxIcon from "@/assets/svg/Redux.svg";
import nextjsIcon from "@/assets/svg/Next-js.svg";
import figmaIcon from "@/assets/svg/Figma.svg";
import Button from "@/components/Button";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="mx-4 mt-8">
        <div>
          <Image src={profilePic} alt="Profile Picture" className="w-full" />
          <div className="flex gap-4 justify-center mt-4">
            <Link href={"https://github.com/arpittheslayer"} target="_blank">
              <svg
                fill="none"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-tia-maria-950 dark:stroke-tia-maria-50"
              >
                <path
                  d="M12.0001 25.3333C5.33341 27.3333 5.33341 22 2.66675 21.3333M21.3334 29.3333V24.1733C21.3834 23.5375 21.2975 22.8984 21.0814 22.2984C20.8653 21.6984 20.524 21.1512 20.0801 20.6933C24.2667 20.2267 28.6667 18.64 28.6667 11.36C28.6664 9.49843 27.9503 7.70826 26.6667 6.36C27.2746 4.73134 27.2316 2.93113 26.5467 1.33333C26.5467 1.33333 24.9734 0.866665 21.3334 3.30666C18.2774 2.47843 15.0561 2.47843 12.0001 3.30666C8.36008 0.866665 6.78675 1.33333 6.78675 1.33333C6.10192 2.93113 6.05894 4.73134 6.66675 6.36C5.37358 7.71826 4.65678 9.52462 4.66675 11.4C4.66675 18.6267 9.06675 20.2133 13.2534 20.7333C12.8147 21.1866 12.4764 21.7272 12.2605 22.3199C12.0446 22.9126 11.9558 23.5441 12.0001 24.1733V29.3333"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
            <Link
              href={"https://linkedin.com/in/arpittheslayer"}
              target="_blank"
            >
              <svg
                fill="none"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-tia-maria-950 dark:stroke-tia-maria-50"
              >
                <path
                  d="M21.3334 10.6667C23.4551 10.6667 25.49 11.5095 26.9903 13.0098C28.4906 14.5101 29.3334 16.5449 29.3334 18.6667V28H24.0001V18.6667C24.0001 17.9594 23.7191 17.2811 23.219 16.781C22.7189 16.2809 22.0407 16 21.3334 16C20.6262 16 19.9479 16.2809 19.4478 16.781C18.9477 17.2811 18.6667 17.9594 18.6667 18.6667V28H13.3334V18.6667C13.3334 16.5449 14.1763 14.5101 15.6766 13.0098C17.1769 11.5095 19.2117 10.6667 21.3334 10.6667Z"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.00008 12H2.66675V28H8.00008V12Z"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.33341 7.99999C6.80617 7.99999 8.00008 6.80608 8.00008 5.33332C8.00008 3.86056 6.80617 2.66666 5.33341 2.66666C3.86066 2.66666 2.66675 3.86056 2.66675 5.33332C2.66675 6.80608 3.86066 7.99999 5.33341 7.99999Z"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>{" "}
            <Link href={"https://instagram.com/arpittheslayer"} target="_blank">
              <svg
                fill="none"
                width="32"
                height="32"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-tia-maria-950 dark:stroke-tia-maria-50"
              >
                <path
                  d="M23.3334 8.66666H23.3467M9.33341 2.66666H22.6667C26.3486 2.66666 29.3334 5.65142 29.3334 9.33332V22.6667C29.3334 26.3486 26.3486 29.3333 22.6667 29.3333H9.33341C5.65152 29.3333 2.66675 26.3486 2.66675 22.6667V9.33332C2.66675 5.65142 5.65152 2.66666 9.33341 2.66666ZM21.3334 15.16C21.498 16.2697 21.3084 17.4029 20.7918 18.3987C20.2751 19.3944 19.4576 20.2019 18.4556 20.7062C17.4536 21.2106 16.318 21.3861 15.2105 21.2079C14.1029 21.0297 13.0798 20.5068 12.2865 19.7135C11.4933 18.9203 10.9704 17.8972 10.7922 16.7896C10.614 15.6821 10.7895 14.5465 11.2938 13.5445C11.7982 12.5425 12.6057 11.725 13.6014 11.2083C14.5971 10.6916 15.7304 10.5021 16.8401 10.6667C17.972 10.8345 19.0199 11.3619 19.829 12.1711C20.6381 12.9802 21.1656 14.0281 21.3334 15.16Z"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4">
          <div>
            <div className="text-h2">Hi I am</div>
            <div className="text-[2rem] font-semibold text-tia-maria-400">
              Arpit Pandey
            </div>
            <div className="text-5xl font-bold">Full Stack</div>
            <div className="text-5xl font-bold w-fit relative left-24">
              Developer
            </div>
          </div>
          <div>
            <p className="text-justify mb-4">
              <span className="font-bold">Front-End Developer</span>{" "}
              specializing in high-performance, pixel-perfect web experiences. I
              bridge the gap between complex design and functional code using{" "}
              <span className="font-bold">
                React, Next.js, and Tailwind CSS.
              </span>{" "}
              With a keen eye for detail and{" "}
              <span className="font-bold">
                a knack for deep-dive debugging,
              </span>{" "}
              I build sleek corporate landing pages that look flawless on every
              screen.
            </p>
            <Button text={"Hire Me"} />
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="mx-4 mt-8">
        <h1 className="text-h1 text-center mb-8">About Me</h1>
        <h2 className="text-h2 mb-4">The Journey</h2>
        <p className="mb-4">
          While I am currently pursuing a degree in Master in Computer
          Applications <span className="font-bold">(MCA)</span> at MATS
          University, my real education happened in the browser. I quickly
          realized that to reach the level of quality I wanted, I had to take my
          learning into my own hands. My obsession with front-end development
          started the moment I wrote my first lines of CSS—seeing a plain page
          transform into a polished interface through precise code was a
          "lightbulb" moment for me.
        </p>
        <h2 className="text-h2 mb-4">My Philosophy: Precision First</h2>
        <p className="mb-4">
          I am a self-taught developer with a relentless focus on the
          "Pixel-Perfect" standard. Whether I am working from a Figma file or
          designing directly in the browser, I don't stop until the spacing,
          typography, and alignment are exactly where they need to be.
        </p>
        <p>
          I don't just build for the desktop; I am a firm believer that a
          website should be as sleek and functional on a phone as it is on a
          27-inch monitor. My workflow is simple: Build, Break, and Debug. I
          enjoy the "detective work" of debugging—identifying layout shifts or
          logic errors and working through the problem until the solution is
          robust and clean.
        </p>
      </div>

      {/* Skills Section */}
      <div className="mx-4 mt-8">
        <h1 className="text-h1 text-center mb-8">Skills</h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <Image src={htmlIcon} alt="HTML Icon" className="size-16" />
            <h2 className="text-h2">HTML</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image src={cssIcon} alt="CSS Icon" className="size-16" />
            <h2 className="text-h2">CSS</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image
              src={javascriptIcon}
              alt="JavaScript Icon"
              className="size-16"
            />
            <h2 className="text-h2">JavaScript</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image src={nodejsIcon} alt="Node.js Icon" className="size-16" />
            <h2 className="text-h2">Node.js</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image src={reactIcon} alt="React Icon" className="size-16" />
            <h2 className="text-h2">React</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image
              src={expressIcon}
              alt="Express.js Icon"
              className="size-16 dark:invert"
            />
            <h2 className="text-h2">Express.js</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image src={mongodbIcon} alt="MongoDB Icon" className="size-16" />
            <h2 className="text-h2">MongoDB</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image
              src={tailwindcssIcon}
              alt="Tailwind CSS Icon"
              className="size-16"
            />
            <h2 className="text-h2">Tailwind CSS</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image src={reduxIcon} alt="Redux Icon" className="size-16" />
            <h2 className="text-h2">Redux</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image src={nextjsIcon} alt="h" className="size-16 dark:invert" />
            <h2 className="text-h2">Next.js</h2>
          </div>
          <div className="flex gap-4 items-center">
            <Image src={figmaIcon} alt="Figma Icon" className="size-16" />
            <h2 className="text-h2">Figma</h2>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
