import { doDeleteCollectionAction } from "@/app/actions/collection";
import { useState, useActionState, useEffect, useRef } from "react";
import { FormInput } from "../shared/input";
import { Result } from "@/types/shared";
import { CollectionWithRelations } from "@/services/collectionService";
import { ActionFeedback } from "@/app/(private)/collections/collections-list";

export const DeleteCollection = ({
  collectionId,

  handleActionState,
}: {
  collectionId: string;
  handleActionState: (state: Result<CollectionWithRelations>) => void;
}) => {
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [deleteState, deleteDispatch, deletePending] = useActionState(
    doDeleteCollectionAction,
    { success: false, errors: [] } as Result<CollectionWithRelations>
  );

  useEffect(() => {
    if (
      !deleteState ||
      (deleteState.success === false &&
        (!deleteState.errors || deleteState.errors.length === 0))
    ) {
      return;
    }

    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    if (deleteState.success) {
      console.log(`Delete success for ${collectionId}, notifying parent.`);
      handleActionState(deleteState);
    } else if (deleteState.errors) {
      const errorMessage = deleteState.errors[0]?.message || "Delete failed.";
      console.error(`Delete failed for ${collectionId}:`, deleteState.errors);
      setFeedback({ message: errorMessage, type: "error" });

      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
      }, 5000);
    }

    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [deleteState, handleActionState, collectionId]);

  const isDisabled = deletePending;

  return (
    <div>
      <form action={deleteDispatch}>
        <FormInput
          type="hidden"
          id={`collectionId-delete-${collectionId}`}
          name="collectionId"
          defaultValue={collectionId}
        />
        <button
          type="submit"
          aria-busy={deletePending}
          disabled={isDisabled}
          className="px-3 py-1 border border-red-500 text-red-300 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {deletePending ? "Deleting..." : "Delete"}
        </button>
        {/* Display local feedback */}
        {feedback && (
          <ActionFeedback message={feedback.message} type={feedback.type} />
        )}
      </form>
    </div>
  );
};
