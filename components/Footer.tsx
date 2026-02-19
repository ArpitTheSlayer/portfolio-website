"use client";

import Image from "next/image";
import logoLight from "@/assets/svg/Logo-Light.svg";
import logoDark from "@/assets/svg/Logo-Dark.svg";
import Link from "next/link";
import { useTheme } from "next-themes";

const Footer = () => {
  const { theme } = useTheme();

  return (
    <div className="mt-8">
      <div className="bg-tia-maria-100 dark:bg-tia-maria-900 flex flex-col items-center py-8">
        <Link href={"/"}>
          <Image
            src={theme === "dark" ? logoDark : logoLight}
            alt="Logo"
            className="size-8 md:size-12 mb-4"
          />
        </Link>
        <ul className="flex flex-col md:flex-row gap-4 md:gap-8 items-center">
          <li className="text-h3 hover:underline">
            <Link href={"#"}>Home</Link>
          </li>
          <li className="text-h3 hover:underline">
            <Link href={"#"}>Projects</Link>
          </li>
          <li className="text-h3 hover:underline">
            <Link href={"#"}>About Me</Link>
          </li>
          <li className="text-h3 hover:underline">
            <Link href={"#"}>Contact</Link>
          </li>
        </ul>
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
          <Link href={"https://linkedin.com/in/arpittheslayer"} target="_blank">
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
      <div className="bg-tia-maria-950 dark:bg-tia-maria-50">
        <p className="text-tia-maria-50 dark:text-tia-maria-950 text-h3 text-center py-4">
          © 2025{" "}
          <Link
            href={"https://github.com/arpittheslayer"}
            target="_blank"
            className="text-tia-maria-500 hover:underline"
          >
            ArpitTheSlayer
          </Link>{" "}
          All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
