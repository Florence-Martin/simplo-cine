// Imports externes (bibliothèques et modules de Next.js)
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaDownload, FaHeart, FaRegHeart, FaShare } from "react-icons/fa";

// Imports internes (modules locaux)
import Badge from "./Badge";

interface ArticleCardProps {
  url: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string;
  badge?: string;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  url,
  title,
  description,
  imageUrl,
  date,
  badge,
}) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isShared, setisShared] = useState(false);

  const toggleShare = () => {
    setisShared(!isShared);
  };

  const toggleFavorite = () => {
    setIsFavorited(!isFavorited);
  };

  const toggleDownload = () => {
    setIsDownloaded(!isDownloaded);
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {badge && <Badge label={badge} />}{" "}
      {/* Place the badge at the top right */}
      <Link href={url}>
        <div className="p-4">
          <Image
            src={imageUrl}
            alt={title}
            width={500}
            height={250}
            className="rounded-lg w-full h-64 object-cover"
          />
        </div>
      </Link>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <div className="flex items-center space-x-4">
            <span onClick={toggleShare} className="cursor-pointer">
              <FaShare
                className={
                  isShared
                    ? "text-blue-500"
                    : "text-gray-600 hover:text-gray-800"
                }
              />
            </span>
            <span onClick={toggleDownload} className="cursor-pointer">
              <FaDownload
                className={
                  isDownloaded
                    ? "text-green-500"
                    : "text-gray-600 hover:text-gray-800"
                }
              />
            </span>
            <span onClick={toggleFavorite} className="cursor-pointer">
              {isFavorited ? (
                <FaHeart className="text-red-500 hover:text-red-700" />
              ) : (
                <FaRegHeart className="text-gray-600 hover:text-gray-800" />
              )}
            </span>
          </div>
        </div>
        <p className="text-gray-700 text-base flex-grow">{description}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <Link
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-200"
          >
            Read more
          </Link>
          <span className="text-gray-500 text-sm">{date}</span>
        </div>
      </div>
    </div>
  );
};
