import Image from "next/image";
import { Video } from "@/types/shared";
import Link from "next/link";

interface VideoListProps {
  videos: Video[];
  channelAvatarUrl: string;
  channelHandle: string;
}

export function VideoList({
  videos,
  channelAvatarUrl,
  channelHandle,
}: VideoListProps) {
  const formattedChannelHandle = channelHandle
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
    .replace(" ", "");
  return (
    <div>
      {videos.map((video) => (
        <div key={video.id}>
          <Link
            href={`https://www.youtube.com/watch?v=${video.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={video.thumbnailUrl}
              alt={video.title}
              width={100}
              height={100}
            />
          </Link>
          <p>{video.title}</p>
          <Link
            className="flex"
            href={`https://www.youtube.com/@${formattedChannelHandle}`}
          >
            <Image
              src={channelAvatarUrl}
              width={24}
              height={24}
              alt={"Channel's Avatar"}
              className="mr-2 rounded-lg shadow"
            />{" "}
            {formattedChannelHandle}
          </Link>
          <p className="text-white-800" style={{ lineBreak: "anywhere" }}>
            {video.description}
          </p>
        </div>
      ))}
    </div>
  );
}
