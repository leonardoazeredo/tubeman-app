"use client";

import React, { useState, useActionState, useEffect, useRef } from "react";
import { checkForUpdatesAction } from "@/app/actions/collection";
import { Result } from "@/types/shared";
import { CollectionWithRelations } from "@/services/collectionService";
import { ActionFeedback } from "@/app/(private)/collections/collections-list";

const initialResultState: Result<CollectionWithRelations> = {
  success: false,
  errors: [],
};

export const CheckForUpdatesButton = ({
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
    checkForUpdatesAction,
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
      // We don't easily know the *exact* number of new videos added here
      // without comparing previous state, so keep feedback simple.
      message = "Check complete.";
      type = "success";
    } else if (checkState.errors) {
      message = checkState.errors[0]?.message || "Check failed.";
      type = "error";
      console.error(
        `Check for updates failed for ${collectionId}:`,
        checkState.errors
      );
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
        className="px-3 py-1 border border-blue-500 text-blue-300 rounded hover:bg-blue-700 disabled:opacity-50" // Blue styling
      >
        {isPending ? "Checking..." : "Check for Updates"}
      </button>

      {feedback && (
        <ActionFeedback message={feedback.message} type={feedback.type} />
      )}
    </form>
  );
};
