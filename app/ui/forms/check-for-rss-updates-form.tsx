"use client";

import React, { useState, useActionState, useEffect, useRef } from "react";
import { checkForUpdatesRSSAction } from "@/app/actions/collection";
import { Result } from "@/types/shared";
import { CollectionWithRelations } from "@/services/collectionService";
import { ActionFeedback } from "@/app/ui/shared/ActionFeedback";

const initialResultState: Result<CollectionWithRelations> = {
  success: false,
  errors: [],
};

export const CheckForRSSUpdatesButton = ({
  collectionId,
  onCheckComplete,
}: {
  collectionId: string;
  onCheckComplete: (state: Result<CollectionWithRelations>) => void;
}) => {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [checkState, checkDispatch, isPending] = useActionState(
    checkForUpdatesRSSAction,
    initialResultState
  );

  useEffect(() => {
    if (
      !checkState ||
      (checkState.success === false &&
        (!checkState.errors || checkState.errors.length === 0))
    ) {
      return;
    }
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    onCheckComplete(checkState);

    let message = "";
    let type: "success" | "error" = "success";

    if (checkState.success) {
      message = "RSS Check complete.";
      type = "success";
    } else if (checkState.errors) {
      message = checkState.errors[0]?.message || "RSS Check failed.";
      type = "error";
      console.error(`RSS Check failed for ${collectionId}:`, checkState.errors);
    }

    setFeedback({ message, type });
    feedbackTimeoutRef.current = setTimeout(() => {
      setFeedback(null);
    }, 5000);

    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [checkState, onCheckComplete, collectionId]);

  return (
    <form action={checkDispatch}>
      <input type="hidden" name="collectionId" value={collectionId} />
      <button
        type="submit"
        aria-busy={isPending}
        disabled={isPending}
        title="Check for recent videos via RSS (fallback, less accurate)"
        className="px-3 py-1 border border-orange-500 text-orange-300 rounded hover:bg-orange-700 disabled:opacity-50"
      >
        {isPending ? "Checking RSS..." : "Check via RSS"}
      </button>
      {feedback && (
        <ActionFeedback message={feedback.message} type={feedback.type} />
      )}
    </form>
  );
};
