import Image from "next/image";

export default function Footer() {
  return (
    <div className="bg-gray-600 text-white text-center py-8 mb-0 lg:px-96">
      <div className="container mx-auto px-4">
        <div>
          <a
            className=""
            href="https://storageazureblogify.blob.core.windows.net/files/Bradley Malgas Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="my-12 px-6 py-2 text-base font-extralight text-white rounded-md outline outline-1 hover:text-white transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 hover:font-extrabold hover:outline-2">
              DOWNLOAD MY FULL CV
            </button>
          </a>
        </div>
        <div className="text-sm mb-12">
          <p>Follow me on social networks</p>
          <div className="flex justify-center space-x-6 my-2">
            <a href="https://www.linkedin.com/in/brad-malgas" target="_blank">
              <Image
                src="/linkedin-logo.png"
                alt="Skills"
                width={50}
                height={50}
              />
            </a>
            <a href="https://www.instagram.com/_brvd_" target="_blank">
              <Image
                src="/instagram-logo.png"
                alt="Skills"
                width={50}
                height={50}
              />
            </a>
            <a href="https://github.com/bradmalgas" target="_blank">
              <Image
                src="/github-logo.png"
                alt="Skills"
                width={50}
                height={50}
              />
            </a>
          </div>
        </div>
        <p className="text-sm">© 2025 Brad Malgas</p>
      </div>
    </div>
  );
}
