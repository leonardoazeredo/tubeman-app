import PrivatePage from "@/app/ui/pages/private-page";
import { getCollectionBySlug } from "@/services/collectionService";
import { VideoList } from "@/app/ui/videos/videos-list";
import { Collection } from "@/prisma/generated/zod";

interface CollectionDetailPage {
  params: Promise<{ collectionSlug: string }>;
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPage) {
  const collectionSlug = (await params).collectionSlug;

  let collection: Collection | null = null;
  let error: string | null = null;

  try {
    const collectionResult = await getCollectionBySlug(collectionSlug);
    if (collectionResult.success) {
      collection = collectionResult.data;
    } else {
      error =
        collectionResult.errors?.[0]?.message ||
        "Failed to load collection details.";
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("Error fetching collection:", e);
    error = "Error loading collection details.";
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!collection) {
    return <div>Collection not found.</div>;
  }

  return (
    <PrivatePage pageTitle={collection.name}>
      <div>
        <h1>{collection.name}</h1>
        <p>Channel ID: {collection.channelId}</p>
        <p>Keywords: {collection.keywords.join(", ")}</p>
        <VideoList
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          videos={collection.videos as any}
          channelHandle={collection.channelId}
          channelAvatarUrl={collection.channelAvatarUrl ?? ""}
        />
      </div>
    </PrivatePage>
  );
}
