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
    <div className="bg-gray-600 py-5 px-4 flex-col rounded-xl outline outline-[6px] outline-gray-300 text-white drop-shadow-sm max-w-[400px] xl:max-w-[600px]">
      <p className="font-bold text-3xl tracking-widest">{title}</p>
      <div className="relative w-full h-[300px] mx-auto my-8 px-8 flex items-center">
        <Image
          className="rounded-md"
          src={image}
          alt={title}
          fill
          style={{ objectFit: "cover" }}
        />
      </div>
      <p className="text-sm leading-tight px-2">{description}</p>
    </div>
  );
}
