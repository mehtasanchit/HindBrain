import { Share } from "../icons/shareicon";

interface cardProps {
  title: string;
  link: string;
  type: "twitter" | "youtube";
}
export function Card({ title, link, type }: cardProps) {
  function getYouTubeEmbedUrl(url: string) {
    const match = url.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : url;
  }

  return (
    <div>
      <div className="p-4 bg-white rounded-md border max-w-72 border-gray-300 min-h-48 min-w-72">
        <div className="flex justify-between">
          <div className="flex items-center text-md">
            <div className="text-gray-500 pr-2">
              <Share></Share>
            </div>
            {title}
          </div>
          <div className="flex items-center">
            <div className="text-gray-500 pr-2">
              <a href={link} target="_blank">
                <Share></Share>
              </a>
            </div>
            <div className="text-gray-500">
              <Share></Share>
            </div>
          </div>
        </div>

        <div className="pt-4">
          {type === "youtube" && (
            <iframe
              className="w-full"
              src={getYouTubeEmbedUrl(link)}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          )}

          {type === "twitter" && (
            <blockquote className="twitter-tweet">
              <a href={link.replace("x.com","twitter.com")}></a>
            </blockquote>
          )}
        </div>
      </div>
    </div>
  );
}
