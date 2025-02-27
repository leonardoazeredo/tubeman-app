"use client";

import Link from "next/link";
import { DbCollection } from "@/types/db";

interface CollectionsListProps {
  collections: DbCollection[]; // Define props interface
}

export function CollectionsList({ collections }: CollectionsListProps) {
  return collections.length > 0 ? (
    <ul>
      {collections.map((collection) => (
        <li key={collection.id}>
          <Link href={`/collections/${collection.slug}`}>
            {collection.name} (Channel ID: {collection.channelId}) -{" "}
            {collection.videos.length} videos
          </Link>
        </li>
      ))}
    </ul>
  ) : (
    <p>No collections created yet.</p>
  );
}
