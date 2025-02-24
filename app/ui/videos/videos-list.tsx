"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Video } from "@/types/shared";
import { createCollection } from "@/services/collectionService";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      console.log("Collection created successfully!", state.data);
      // Redirect to collections page after successful creation
      router.push("/collections");
    } else if (!state.success && state.errors && state.errors?.length > 0) {
      console.error("Error creating collection:", state.errors);
      // Handle errors (e.g., display error message to the user)
    }
  }, [state, router]);

  if (!hasSearched) {
    return <p>Submit the form to fetch videos.</p>;
  }

  if (videos.length === 0) {
    return <p>No videos found.</p>;
  }

  return (
    <>
      <form action={dispatch}>
        <input type="hidden" name="userId" value={session?.user?.id} />
        <input type="hidden" name="videos" value={JSON.stringify(videos)} />
        <input type="hidden" name="keywords" value={JSON.stringify(keywords)} />
        <input type="hidden" name="channelHandle" value={channelHandle} />
        <div>
          <label htmlFor="collectionName">Collection Name</label>
          <input
            id="collectionName"
            name="collectionName"
            type="text"
            placeholder="Name this Collection"
            defaultValue="Sample Name"
            disabled={pending}
            required
          />
        </div>
        <button type="submit">Create Collection</button>
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
            <Link href={`https://www.youtube.com/@${channelHandle}`}>
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
