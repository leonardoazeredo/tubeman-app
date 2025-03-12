// collections-list.tsx (Conceptual - You'll need to adapt to your actual UI)
"use client";

import { useActionState, useEffect } from "react";
import { Collection } from "@/prisma/generated/zod";
import { DbCollection } from "@/types/db";
import { Result } from "@/types/shared";
import { FormInput } from "../shared/input";
import {
  deleteCollectionAction,
  updateCollectionAction,
} from "@/app/actions/collection";

interface CollectionsListProps {
  collections: DbCollection[];
}

export const CollectionsList: React.FC<CollectionsListProps> = ({
  collections,
}) => {
  const [updateCollectionState, updateCollectionDispatch, pending] =
    useActionState(updateCollectionAction, {
      success: false,
      errors: [],
    });

  const [deleteState, deleteDispatch] = useActionState(deleteCollectionAction, {
    success: false,
    errors: [],
  });

  useEffect(() => {
    function stateCheck(state: Result<Collection>) {
      if (state.success) {
        console.log("Collection updated successfully!", state.data);
      } else if (!state.success && state.errors && state.errors?.length > 0) {
        console.error("Error updating collection:", state.errors);
        //TODO Handle errors (e.g., display error message to the user)
      }
    }
    stateCheck(updateCollectionState ? updateCollectionState : deleteState);
  }, [updateCollectionState, deleteState]);

  const handleDelete = async (collectionId: string) => {
    if (confirm("Are you sure you want to delete this collection?")) {
      const formData = new FormData();
      formData.append("collectionId", collectionId);
      deleteDispatch(formData);
    }
  };

  return (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>
          {collection.name} - {collection.channelId}
          <form action={updateCollectionDispatch}>
            <FormInput
              type="text"
              id="collectionName"
              name="collectionName"
              defaultValue={collection.name}
              placeholder={collection.name}
              disabled={pending}
              className=" bg-gray-800"
            />
            <FormInput
              type="hidden"
              id="collectionId"
              name="collectionId"
              defaultValue={collection.id}
            />

            <button type="submit" aria-busy={pending}>
              Update
            </button>
          </form>
          <button
            onClick={() => handleDelete(collection.id)}
            aria-busy={pending}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};
