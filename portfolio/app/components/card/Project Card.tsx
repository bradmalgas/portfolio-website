import Image from "next/image";

interface ProjectCardProps {
  title: string;
  image: string;
  description?: string;
}

export default function ProjectCard({
  title,
  image,
  description,
}: ProjectCardProps) {
  return (
    <div className="bg-gray-600 py-5 px-4 flex-col rounded-xl outline outline-[6px] outline-gray-300 text-white drop-shadow-sm max-w-[400px] xl:max-w-[800px]">
      <p className="font-bold text-3xl tracking-widest">{title}</p>
      <div className="relative w-full h-[180px] mx-auto my-8 flex items-center">
        <Image src={image} alt="Skills" fill style={{ objectFit: "contain" }} />
      </div>
      <p className="text-[13px] leading-tight px-2">{description}</p>
    </div>
  );
}
