"use client";
import { useState } from "react";
import CloseIcon from "../icons/CloseIcon";
import MenuIcon from "@/app/components/icons/MenuIcon";
import Link from "next/link";
import BradLogoIcon from "../icons/BradLogoIcon";

interface SideNavProps {
  className?: string;
}

export default function SideNav({ className }: SideNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className={className}>
      {" "}
      <div>
        <div className="max-w-min" onMouseDown={() => setIsOpen(!isOpen)}>
          <MenuIcon className="h-full hover:cursor-pointer" />
        </div>
        <div
          className={`fixed inset-0 z-20 md:w-[50%] w-[70%] ${
            isOpen
              ? "translate-x-0 transition-transform duration-400 ease-out"
              : "translate-x-[-100%] transition-transform duration-400 ease-in"
          }`}
        >
          <div
            id="slide-nav-component"
            className="bg-gray-600 text-white w-full md:max-w-md h-screen p-5 pt-8 relative"
          >
            <div
              className="absolute top-3 right-8"
              onMouseDown={() => setIsOpen(!isOpen)}
            >
              <CloseIcon className="hover:cursor-pointer" />
            </div>
            <div className="grid gap-4 font-semibold lg:font-normal text-xl md:text-2xl lg:text-2xl rounded ml-5">
              <BradLogoIcon
                className="h-16 border-0 border-b border-white"
                fillColour="#ffffff"
              />
              <Link className="max-w-fit" href="/">
                <p>Home</p>
              </Link>
              <Link className="max-w-fit" href="/projects">
                <p className="transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold">
                  Projects
                </p>
              </Link>
              <a
                className="max-w-fit"
                href="https://blog.bradmalgas.com"
                target="_blank"
              >
                <p>Blog</p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`bg-black opacity-30 inset-0 fixed z-10 ${
          isOpen
            ? "opacity-30 transition-opacity duration-75 ease-in"
            : "opacity-0 invisible transition-[opacity,visibility] duration-75 ease-in"
        }`}
        onMouseDown={() => setIsOpen(!isOpen)}
      ></div>
    </div>
  );
}
