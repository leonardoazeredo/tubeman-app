"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Video } from "@/types/shared";
import { createCollection } from "@/services/collectionService";
import { useRouter } from "next/navigation";
import { FormInput } from "../shared/input";

interface VideoListProps {
  videos: Video[];
  hasSearched: boolean;
  channelHandle: string;
  channelAvatarUrl: string;
  keywords?: string[];
}

export function VideoList({
  videos,
  channelHandle,
  channelAvatarUrl,
  keywords,
}: VideoListProps) {
  const session = useSession();

  const [state, dispatch, pending] = useActionState(createCollection, {
    success: false,
    errors: [],
  });
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      console.log("Collection created successfully!", state.data);
      router.push("/collections");
    } else if (!state.success && state.errors && state.errors?.length > 0) {
      console.error("Error creating collection:", state.errors);
      //TODO Handle errors (e.g., display error message to the user)
    }
  }, [state, router]);

  const formattedChannelHandle = channelHandle
    .replace(/(^\w|\s\w)/g, (m) => m.toUpperCase())
    .replace(" ", "");

  return (
    <>
      <form action={dispatch}>
        <input type="hidden" name="userId" value={session?.data?.user?.id} />
        <input type="hidden" name="videos" value={JSON.stringify(videos)} />
        <input type="hidden" name="keywords" value={JSON.stringify(keywords)} />
        <input type="hidden" name="channelHandle" value={channelHandle} />

        <FormInput
          label="Collection Name "
          id="collectionName"
          name="collectionName"
          type="text"
          placeholder="Name this Collection"
          defaultValue="Sample Name"
          required
          className="bg-gray-800"
          disabled={pending}
        />

        <button
          type="submit"
          disabled={pending}
          className="border-gray-500 border rounded-xl px-2 hover:px-3 hover:py-1 hover:rounded-3xl hover:bg-opacity-35 hover:bg-white transition-all "
        >
          Create Collection
        </button>
      </form>
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
    </>
  );
}
