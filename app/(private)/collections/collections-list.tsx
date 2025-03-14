"use client";

import { useActionState, useEffect, useState, useCallback } from "react";
import { Result } from "@/types/shared";

import {
  updateCollectionAction,
  doDeleteCollectionAction,
} from "@/app/actions/collection";
import { CollectionWithRelations } from "@/services/collectionService";
import Link from "next/link";
import { FormInput } from "@/app/ui/shared/input";

interface CollectionsListProps {
  collections: CollectionWithRelations[];
}

export const CollectionsList: React.FC<CollectionsListProps> = ({
  collections: initialCollections,
}) => {
  const [collections, setCollections] =
    useState<CollectionWithRelations[]>(initialCollections);
  const [updateError, setUpdateError] = useState<string | null>(null); // Add error state
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      if (state.success) {
        if (state.data?.id) {
          setCollections((prevCollections) => {
            const index = prevCollections.findIndex(
              (c) => c.id === state.data.id
            );
            if (index > -1) {
              if (state === updateCollectionState) {
                const newCollections = [...prevCollections];
                newCollections[index] = state.data;
                return newCollections;
              } else {
                return prevCollections.filter((c) => c.id !== state.data.id);
              }
            } else {
              return prevCollections;
            }
          });
        }
      } else if (state.errors) {
        console.error("Error in action:", state.errors);

        if (state === updateCollectionState) {
          setUpdateError(state.errors[0]?.message || "Update failed");
        } else if (state === deleteState) {
          setDeleteError(state.errors[0]?.message || "Delete failed");
        }
      }
    },
    [updateCollectionState, deleteState]
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

  useEffect(() => {
    setCollections(initialCollections);
  }, [initialCollections]);

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

            <button type="submit" aria-busy={isPending} disabled={isPending}>
              {updatePending ? "Updating..." : "Update"}
            </button>
            {updateError && <p className="text-red-500">{updateError}</p>}
          </form>
          <form
            action={async () => {
              const formData = new FormData();
              formData.append("collectionId", collection.id);
              await deleteDispatch(formData);
            }}
          >
            <button type="submit" aria-busy={isPending} disabled={isPending}>
              {deletePending ? "Deleting..." : "Delete"}
            </button>
            {deleteError && <p className="text-red-500">{deleteError}</p>}
          </form>
        </li>
      ))}
    </ul>
  );
};
