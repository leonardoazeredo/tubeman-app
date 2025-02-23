"use client";

import { useActionState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Video } from "@/types/shared";
import { createCollection } from "@/services/collectionService";

interface VideoListProps {
  videos: Video[];
  hasSearched: boolean;
  channelHandle?: string;
  keywords?: string[];
}

export function VideoList({
  videos,
  hasSearched,
  channelHandle,
  keywords,
}: VideoListProps) {
  const { data: session } = useSession();
  const [state, dispatch, pending] = useActionState(createCollection, {
    success: false,
    errors: [],
  });
  if (!hasSearched) {
    return (
      <p className="text-center text-gray-600">
        Submit the form to fetch videos.
      </p>
    );
  }

  if (videos.length === 0) {
    return <p className="text-center text-gray-600">No videos found.</p>;
  }

  console.log(state);

  return (
    <>
      <form action={dispatch}>
        <input type="hidden" name="userId" value={session?.user?.id} />
        <input type="hidden" name="videos" value={JSON.stringify(videos)} />
        <input type="hidden" name="keywords" value={JSON.stringify(keywords)} />
        <input type="hidden" name="channelHandle" value={channelHandle} />
        <div className="flex grow flex-col gap-2">
          <label
            htmlFor="collectionName"
            className="text-gray-700 dark:text-gray-200"
          >
            Collection Name
          </label>
          <input
            id="collectionName"
            name="collectionName"
            type="text"
            className="w-full grow rounded-md border bg-blue-800 p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-500 disabled:text-white"
            placeholder="Name this Collection"
            defaultValue="Sample Name"
            disabled={pending}
            required
          />
        </div>
        <button
          type="submit"
          className="mb-4 w-48 rounded-md bg-blue-600 p-2 text-white shadow hover:bg-blue-700 md:mx-auto"
        >
          Create Collection
        </button>
      </form>
      <div className="overview card grid gap-6 rounded-lg bg-gray-800 p-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <div
            key={video.id}
            className="flex flex-col items-center overflow-hidden rounded-lg bg-gray-700 p-4 shadow-lg"
          >
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
                className="mb-1 rounded-lg shadow"
              />
            </Link>
            <p className="text-white-800 mb-2">{video.title}</p>
            <Link
              href={`https://www.youtube.com/@${channelHandle}`}
              className="mb-2 flex flex-row items-center"
            >
              {/* <Image
                src={video.channelAvatarUrl}
                width={24}
                height={24}
                alt={"Channel's Avatar"}
                className="mr-2 rounded-lg shadow"
              />{" "} */}
              {channelHandle}
            </Link>
            <p className="text-white-800" style={{ lineBreak: "anywhere" }}>
              {video.description}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}
