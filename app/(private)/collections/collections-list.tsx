"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Result } from "@/types/shared";

import { CollectionWithRelations } from "@/services/collectionService";
import Link from "next/link";
import { UpdateCollectionName } from "@/app/ui/forms/update-collection-form";
import { DeleteCollection } from "@/app/ui/forms/delete-collection-form";
import { CheckForUpdatesButton } from "@/app/ui/forms/check-for-updates-form";
import { CheckForRSSUpdatesButton } from "@/app/ui/forms/check-for-rss-updates-form";

interface CollectionsListProps {
  collections: CollectionWithRelations[];
}

export const CollectionsList: React.FC<CollectionsListProps> = ({
  collections: initialCollections,
}) => {
  const [collections, setCollections] =
    useState<CollectionWithRelations[]>(initialCollections);

  const handleUpdate = useCallback((state: Result<CollectionWithRelations>) => {
    if (state.success && state.data?.id) {
      const updatedCollection = state.data;

      setCollections((prevCollections) => {
        const exists = prevCollections.some(
          (c) => c.id === updatedCollection.id
        );
        if (exists) {
          console.log(`Parent updated collection ${updatedCollection.id}`);
          return prevCollections.map((c) =>
            c.id === updatedCollection.id ? updatedCollection : c
          );
        } else {
          // This case might occur if data loads/changes between action start and finish
          // Or if called inappropriately by delete. Log and return previous state.
          console.warn(
            `Received success state for collection not found in current list: ${updatedCollection.id}`
          );
          return prevCollections;
        }
      });
    } else if (!state.success && state.errors) {
      console.error(
        "An update action failed in a child component:",
        state.errors
      );
    }
  }, []);

  const handleDelete = useCallback((state: Result<CollectionWithRelations>) => {
    if (state.success && state.data?.id) {
      const deletedId = state.data.id;

      setCollections((prev) => {
        console.log(`Parent removing collection ${deletedId} from list.`);
        return prev.filter((c) => c.id !== deletedId);
      });
    } else if (!state.success && state.errors) {
      console.error("Delete action failed:", state.errors);
    }
  }, []);

  useEffect(() => {
    setCollections(initialCollections);
  }, [initialCollections]);

  return (
    <ul className="space-y-4">
      {collections.map((collection) => {
        return (
          <li key={collection.id} className="border p-4 rounded-md bg-gray-800">
            <div className="flex justify-between items-center mb-2">
              <Link
                href={`/collections/${collection.slug}`}
                className="text-xl font-semibold text-indigo-400 hover:underline"
              >
                {collection.name} - {collection.channel.name}
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 items-center mt-2">
              <UpdateCollectionName
                collection={collection}
                onUpdateComplete={handleUpdate}
              />

              <DeleteCollection
                collectionId={collection.id}
                handleActionState={handleDelete}
              />

              <CheckForUpdatesButton
                collectionId={collection.id}
                onCheckComplete={handleUpdate}
              />

              <CheckForRSSUpdatesButton
                collectionId={collection.id}
                onCheckComplete={handleUpdate}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
