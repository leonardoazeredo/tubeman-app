import { doDeleteCollectionAction } from "@/app/actions/collection";
import { useState, useActionState, useEffect, useRef } from "react"; // Added useRef
import { FormInput } from "../shared/input";
import { Result } from "@/types/shared"; // Import ValidationError
import { CollectionWithRelations } from "@/services/collectionService";
import { ActionFeedback } from "@/app/(private)/collections/collections-list";

export const DeleteCollection = ({
  collectionId,
  // Optional: Rename prop for clarity if desired, e.g., onActionComplete
  handleActionState,
}: {
  collectionId: string;
  handleActionState: (state: Result<CollectionWithRelations>) => void;
}) => {
  // Local state for error specific to this delete action
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // useActionState is local to this component instance
  const [deleteState, deleteDispatch, deletePending] = useActionState(
    doDeleteCollectionAction,
    { success: false, errors: [] } as Result<CollectionWithRelations> // Initial state
  );

  // Effect to react to the completion of the delete action
  useEffect(() => {
    // Guard against initial state or if state hasn't changed meaningfully
    if (
      !deleteState ||
      (deleteState.success === false &&
        (!deleteState.errors || deleteState.errors.length === 0))
    ) {
      return;
    }

    // Clear any existing feedback timeout
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
    }

    if (deleteState.success) {
      // If successful, notify the parent component to update its list
      // The parent will likely cause this component to unmount
      console.log(`Delete success for ${collectionId}, notifying parent.`);
      handleActionState(deleteState);
      // No need to set local feedback if it's unmounting
    } else if (deleteState.errors) {
      // If deletion failed, set local feedback
      const errorMessage = deleteState.errors[0]?.message || "Delete failed.";
      console.error(`Delete failed for ${collectionId}:`, deleteState.errors);
      setFeedback({ message: errorMessage, type: "error" });

      // Clear the error message after some time
      feedbackTimeoutRef.current = setTimeout(() => {
        setFeedback(null);
      }, 5000);
    }

    // Cleanup timeout on unmount
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
    };
  }, [deleteState, handleActionState, collectionId]); // Include dependencies

  // Determine if *this specific* button should be disabled
  const isDisabled = deletePending;

  return (
    <div>
      <form action={deleteDispatch}>
        <FormInput
          type="hidden"
          id={`collectionId-delete-${collectionId}`} // Ensure unique ID if needed elsewhere
          name="collectionId"
          defaultValue={collectionId}
        />
        <button
          type="submit"
          aria-busy={deletePending} // Busy state tied to this instance
          disabled={isDisabled} // Disabled if this OR global is pending
          // Add standard button styling (example)
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
