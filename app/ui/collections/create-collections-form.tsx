"use client";
import { useActionState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { createCollection } from "@/services/collectionService";
import { useRouter } from "next/navigation";
import { FormInput } from "../shared/input";
import { Video } from "@/types/shared";

interface CreateCollectionFormProps {
  videos: Video[];
  channelHandle: string;
  keywords?: string[];
  channelAvatarUrl: string;
}

export function CreateCollectionForm({
  videos,
  channelHandle,
  keywords,
  channelAvatarUrl,
}: CreateCollectionFormProps) {
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

  return (
    <>
      <form action={dispatch}>
        <input type="hidden" name="userId" value={session?.data?.user?.id} />
        <input type="hidden" name="videos" value={JSON.stringify(videos)} />
        <input type="hidden" name="keywords" value={JSON.stringify(keywords)} />
        <input type="hidden" name="channelHandle" value={channelHandle} />
        <input type="hidden" name="channelAvatarUrl" value={channelAvatarUrl} />

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
    </>
  );
}
