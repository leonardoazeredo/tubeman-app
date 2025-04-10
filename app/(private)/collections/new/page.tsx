"use client";

import { Result, ValidationError, Video } from "@/types/shared";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useActionState, useEffect, useState } from "react";
import { getVideosDataAction } from "@/app/actions/video";
import { FormInput } from "@/app/ui/shared/input";
import { CreateCollectionForm } from "@/app/(private)/collections/new/create-collections-form";
import { VideoList } from "@/app/ui/videos/videos-list";

export default function CreateNewCollectionPage() {
  return (
    <Suspense fallback={<CreateNewCollectionPageLoading />}>
      <CreateNewCollectionPageContent />
    </Suspense>
  );
}

function CreateNewCollectionPageContent() {
  const [state, dispatch, pending] = useActionState<
    Result<{ videos: Video[]; channelAvatarUrl: string }>,
    FormData
  >(getVideosDataAction, { success: false, errors: [] });
  const [formError, setFormError] = useState<ValidationError[] | undefined>(
    undefined
  );

  const searchParams = useSearchParams();

  const [videos, setVideos] = useState<Video[] | undefined>(undefined);
  const [channelAvatarUrl, setChannelAvatarUrl] = useState<string | undefined>(
    undefined
  );

  const hasSearched: boolean =
    (state?.success && state.data.videos.length > 0) || false;

  const router = useRouter();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const channelHandle = formData.get("channelHandle")?.toString() || "";
    const keywords = formData.get("keywords")?.toString() || "";

    const url = new URL(window.location.href);
    if (channelHandle) {
      url.searchParams.set("channelHandle", channelHandle);
    } else {
      url.searchParams.delete("channelHandle");
    }

    if (keywords) {
      url.searchParams.set("keywords", keywords);
    } else {
      url.searchParams.delete("keywords");
    }

    router.push(url.toString());
  };

  useEffect(() => {
    if (!state.success && state.errors) {
      setFormError(undefined);
      setVideos(undefined);
      setChannelAvatarUrl(undefined);
      state.errors.forEach((error) => {
        setFormError((prevErrors) =>
          prevErrors ? [...prevErrors, error] : [error]
        );
      });
    } else if (state.success) {
      setFormError(undefined);
      setVideos(state.data.videos);
      setChannelAvatarUrl(state.data.channelAvatarUrl);
    }
  }, [state]);

  return (
    <>
      <h1>Create New Collection</h1>
      <form action={dispatch} onSubmit={handleSubmit}>
        <div>
          <FormInput
            type="text"
            id="channelHandle"
            name="channelHandle"
            placeholder="Channel Handle (e.g., @CorridorCrew)"
            defaultValue={searchParams.get("channelHandle") || ""}
            disabled={pending}
            className=" bg-gray-800"
            label="Channel Handle "
            required
          />

          <FormInput
            label="Collection Name "
            type="text"
            required
            id="keywords"
            name="keywords"
            placeholder="Keywords (e.g., VFX, CGI)"
            disabled={pending}
            className="bg-gray-800"
            defaultValue={searchParams.get("keywords") || ""}
          />
        </div>
        <button
          type="submit"
          className="border-gray-500 border rounded-xl px-2 hover:px-3 hover:py-1 hover:rounded-3xl hover:bg-opacity-35 hover:bg-white transition-all "
          disabled={pending}
        >
          {pending ? "Fetching..." : "Fetch Videos"}
        </button>
        {formError && (
          <div className="mt-4 text-red-500">
            {formError.map((error, index) => (
              <p key={index} className="text-sm">
                {error.message}
              </p>
            ))}
          </div>
        )}
      </form>

      {pending && (
        <div className="mt-4">
          <p>Scraping...</p>
        </div>
      )}

      {!state.success &&
        formError &&
        formError.map((error, index) => (
          <p key={index} className="text-red-500">
            {error.message}
          </p>
        ))}

      {!pending && videos && videos.length === 0 && !formError && (
        <p>No videos found matching your criteria.</p>
      )}

      {!hasSearched && !pending && <p>Submit the form to fetch videos.</p>}

      {!videos || (!channelAvatarUrl && <p>No videos found.</p>)}

      {!pending && videos && videos.length > 0 && channelAvatarUrl && (
        <>
          <CreateCollectionForm
            videos={videos}
            channelHandle={searchParams.get("channelHandle") || ""}
            keywords={searchParams.get("keywords")?.split(" ")}
            channelAvatarUrl={channelAvatarUrl}
          />
          <VideoList
            videos={videos}
            channelAvatarUrl={channelAvatarUrl}
            channelHandle={searchParams.get("channelHandle") || ""}
          />
        </>
      )}
    </>
  );
}

function CreateNewCollectionPageLoading() {
  return (
    <div>
      <h1>Create New Collection</h1>
      <p>Loading collection creator...</p>
    </div>
  );
}
