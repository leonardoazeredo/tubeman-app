"use client";

import { scrapeVideos } from "@/app/actions/scrape";
import { Result, ValidationError, Video } from "@/types/shared";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { VideoList } from "../videos/videos-list";

export default function VideosSearchForm() {
  const [state, dispatch, pending] = useActionState<Result<Video[]>, FormData>(
    scrapeVideos,
    { success: false, errors: [] }
  );
  const [formError, setFormError] = useState<ValidationError[] | undefined>(
    undefined
  );
  const videos: Video[] = [];

  const hasSearched: boolean =
    (state?.success && state.data.length > 0) || false;

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
      state.errors.forEach((error) => {
        setFormError((prevErrors) =>
          prevErrors ? [...prevErrors, error] : [error]
        );
      });
    } else if (state.success) {
      setFormError(undefined);
      console.log("Signup successful!");
    }
  }, [state]);

  return (
    <>
      <form action={dispatch} onSubmit={handleSubmit}>
        <div>
          <div>
            <label htmlFor="channelHandle">Channel Handle</label>
            <input
              type="text"
              id="channelHandle"
              name="channelHandle"
              placeholder="Channel Handle (e.g., @CorridorCrew)"
              disabled={pending}
            />
          </div>
          <div>
            <label htmlFor="keywords">Keywords</label>
            <input
              type="text"
              id="keywords"
              name="keywords"
              placeholder="Keywords (e.g., VFX, CGI)"
              disabled={pending}
            />
          </div>
        </div>
        <button type="submit" disabled={pending}>
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

      <VideoList
        videos={videos}
        channelHandle={""}
        hasSearched={hasSearched}
        keywords={[]}
      />
    </>
  );
}
