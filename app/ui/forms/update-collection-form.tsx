"use client";

import { updateCollectionAction } from "@/app/actions/collection";
import { useState, useActionState, useEffect, useRef } from "react";
import { FormInput } from "../shared/input";
import { Result } from "@/types/shared";
import { CollectionWithRelations } from "@/services/collectionService";
import { ActionFeedback } from "@/app/(private)/collections/collections-list";

export const UpdateCollectionName = ({
  collection,
  onUpdateComplete,
}: {
  collection: CollectionWithRelations;
  onUpdateComplete: (state: Result<CollectionWithRelations>) => void;
}) => {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [updateState, updateDispatch, isPending] = useActionState(
    updateCollectionAction,
    { success: false, errors: [] } as Result<CollectionWithRelations>
  );

  useEffect(() => {
    if (
      !updateState ||
      (updateState.success === false &&
        (!updateState.errors || updateState.errors.length === 0))
    ) {
      return;
    }

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    onUpdateComplete(updateState);

    if (updateState.success) {
      setFeedback({ message: "Name updated.", type: "success" });
    } else if (updateState.errors) {
      const errorMessage = updateState.errors[0]?.message || "Update failed.";
      setFeedback({ message: errorMessage, type: "error" });
      console.error(`Update failed for ${collection.id}:`, updateState.errors);
    }

    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 5000);

    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [updateState, onUpdateComplete, collection.id]);

  return (
    <form action={updateDispatch} className="flex items-center space-x-2">
      <FormInput
        type="text"
        id={`collectionName-${collection.id}`}
        name="collectionName"
        defaultValue={collection.name}
        placeholder="New name"
        disabled={isPending}
        className="bg-gray-700 px-2 py-1 rounded text-sm w-auto"
      />

      <input type="hidden" name="collectionId" value={collection.id} />
      <button
        type="submit"
        aria-busy={isPending}
        disabled={isPending}
        className="px-3 py-1 border border-green-500 text-green-300 rounded hover:bg-green-700 disabled:opacity-50"
      >
        {isPending ? "Saving..." : "Update Name"}
      </button>

      {feedback && (
        <ActionFeedback message={feedback.message} type={feedback.type} />
      )}
    </form>
  );
};
