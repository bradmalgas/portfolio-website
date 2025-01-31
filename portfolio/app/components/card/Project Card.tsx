"use client";

import Image from "next/image";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  image: string;
  description?: string;
  githubLink: string;
  blogLink: string;
}

export default function ProjectCard({
  title,
  image,
  description,
  githubLink,
  blogLink,
}: ProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="bg-gray-600 py-5 px-4 flex-col rounded-xl outline outline-[6px] outline-gray-300 text-white drop-shadow-sm max-w-[400px] xl:max-w-[600px]">
      <p className="font-bold text-3xl tracking-widest">{title}</p>

      <div
        className="relative w-full h-[300px] mx-auto my-8 px-8 flex items-center overflow-hidden rounded-md"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Image
          className="rounded-md"
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />

        {/* Overlay */}
        <div
          className={`rounded-md absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <a
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition hover:cursor-pointer"
          >
            <div>
              <p>View Code on GitHub</p>
            </div>
          </a>
          <a
            href={blogLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-300 hover:text-black transition hover:cursor-pointer"
          >
            Learn more
          </a>
        </div>
      </div>

      <p className="text-sm leading-tight px-2">{description}</p>
    </div>
  );
}
