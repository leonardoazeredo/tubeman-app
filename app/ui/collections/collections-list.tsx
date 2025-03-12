"use client";

import { useActionState, useEffect, useState, useCallback } from "react";
import { Result } from "@/types/shared";
import { FormInput } from "../shared/input";
import {
  updateCollectionAction,
  doDeleteCollectionAction,
} from "@/app/actions/collection";
import { CollectionWithRelations } from "@/services/collectionService";
import Link from "next/link";

interface CollectionsListProps {
  collections: CollectionWithRelations[];
}

export const CollectionsList: React.FC<CollectionsListProps> = ({
  collections: initialCollections,
}) => {
  const [collections, setCollections] =
    useState<CollectionWithRelations[]>(initialCollections);

  const [updateCollectionState, updateCollectionDispatch, updatePending] =
    useActionState(updateCollectionAction, {
      success: false,
      errors: [],
    });

  const [deleteState, deleteDispatch, deletePending] = useActionState(
    doDeleteCollectionAction,
    {
      success: false,
      errors: [],
    }
  );

  const handleActionState = useCallback(
    (state: Result<CollectionWithRelations>) => {
      console.log("handleActionState called with:", state); // Log the entire state

      if (state.success) {
        if (state.data?.id) {
          setCollections((prevCollections) => {
            const index = prevCollections.findIndex(
              (c) => c.id === state.data.id
            );
            if (index > -1) {
              //It exists, check if it's from delete or update.
              if (state === updateCollectionState) {
                // Update: Replace the existing collection
                const newCollections = [...prevCollections];
                newCollections[index] = state.data;
                return newCollections;
              } else {
                //It is delete
                return prevCollections.filter((c) => c.id !== state.data.id);
              }
            } else {
              return prevCollections; //Should never happen.
            }
          });
        }
      } else if (state.errors) {
        console.error("Error in action:", state.errors);
        // TODO: Display error message to the user
      }
    },
    [updateCollectionState] // Add updateCollectionState as dependency.
  );

  useEffect(() => {
    if (updateCollectionState && updateCollectionState.success) {
      handleActionState(updateCollectionState);
    }
  }, [updateCollectionState, handleActionState]);

  useEffect(() => {
    if (deleteState && deleteState.success) {
      handleActionState(deleteState);
    }
  }, [deleteState, handleActionState]);

  const isPending = updatePending || deletePending;

  return (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>
          <Link href={`/collections/${collection.slug}`}>
            {collection.name} - {collection.channel.name}
          </Link>
          <form action={updateCollectionDispatch}>
            <FormInput
              type="text"
              id={`collectionName-${collection.id}`}
              name="collectionName"
              defaultValue={collection.name}
              placeholder={collection.name}
              disabled={isPending}
              className="bg-gray-800"
            />
            <FormInput
              type="hidden"
              id={`collectionId-${collection.id}`}
              name="collectionId"
              defaultValue={collection.id}
            />

            <button type="submit" aria-busy={isPending}>
              Update
            </button>
          </form>
          <form
            action={async () => {
              const formData = new FormData();
              formData.append("collectionId", collection.id);
              await deleteDispatch(formData);
            }}
          >
            <button type="submit" aria-busy={isPending}>
              Delete
            </button>
          </form>
        </li>
      ))}
    </ul>
  );
};
