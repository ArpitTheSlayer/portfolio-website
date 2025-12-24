"use client";

import Image from "next/image";
import logoLight from "@/assets/svg/Logo-Light.svg";
import logoDark from "@/assets/svg/Logo-Dark.svg";
import moon from "@/assets/svg/Moon.svg";
import sun from "@/assets/svg/Sun.svg";
import Button from "./Button";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex justify-between m-4 relative">
      <Link href={"/"}>
        <Image
          src={theme === "dark" ? logoDark : logoLight}
          alt="Logo"
          className="size-8"
        />
      </Link>
      <div className="flex gap-8">
        <Image
          src={theme === "dark" ? sun : moon}
          alt={theme === "dark" ? "Sun icon" : "Half moon icon"}
          onClick={() => {
            setTheme(theme === "dark" ? "light" : "dark");
          }}
          className="size-8 cursor-pointer"
        />
        <svg
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          onClick={() => setShowMenu(!showMenu)}
          className="size-8 cursor-pointer stroke-tia-maria-950 dark:stroke-tia-maria-50 select-none"
        >
          <path
            d="M4 16H28M4 8H28M4 24H28"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div
        className={`absolute top-12 bg-tia-maria-50 dark:bg-tia-maria-950 w-full p-4 ${
          showMenu ? "" : "hidden"
        }`}
      >
        <ul className="flex flex-col gap-4 items-center">
          <li className="text-h3">
            <Link href={"#"}>Home</Link>
          </li>
          <li className="text-h3">
            <Link href={"#"}>Projects</Link>
          </li>
          <li className="text-h3">
            <Link href={"#"}>About Me</Link>
          </li>
          <li className="text-h3">
            <Link href={"#"}>Contact</Link>
          </li>
          <Button text={"Download CV"} link={"/Resume.pdf"} />
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
