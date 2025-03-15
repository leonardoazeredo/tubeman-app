import PrivatePage from "@/app/ui/pages/private-page";
import { getCollectionBySlug } from "@/services/collectionService";
import { VideoList } from "@/app/ui/videos/videos-list";
import { Suspense } from "react";
import { Metadata } from "next";

interface CollectionDetailPageProps {
  params: { collectionSlug: string };
}

export async function generateMetadata({
  params,
}: CollectionDetailPageProps): Promise<Metadata> {
  const { collectionSlug } = params;
  const collectionResult = await getCollectionBySlug(collectionSlug);
  if (collectionResult.success) {
    return {
      title: `Collection: ${collectionResult.data.name}`,
    };
  }
  return {
    title: `Collection Details`,
  };
}

export default async function CollectionDetailPage({
  params,
}: CollectionDetailPageProps) {
  const { collectionSlug } = params;

  return (
    <Suspense fallback={<CollectionDetailPageLoading />}>
      <CollectionDetailPageContent collectionSlug={collectionSlug} />
    </Suspense>
  );
}

async function CollectionDetailPageContent({
  collectionSlug,
}: {
  collectionSlug: string;
}) {
  const collectionResult = await getCollectionBySlug(collectionSlug);

  if (!collectionResult.success) {
    return (
      <div>
        Error:{" "}
        {collectionResult.errors?.[0]?.message || "Failed to load collection."}
      </div>
    );
  }

  const collection = collectionResult.data;

  if (!collection) {
    return <div>Collection not found.</div>;
  }

  return (
    <PrivatePage pageTitle={collection.name}>
      <div>
        <h1>{collection.name}</h1>
        <p>Channel ID: {collection.channel.channelId}</p>
        <p>
          Keywords:{" "}
          {collection.collectionKeywords
            .map((ck) => ck.keyword.text)
            .join(", ")}
        </p>
        <VideoList
          videos={collection.collectionVideos.map((video) => video.video)}
          channelHandle={collection.channel.channelId}
          channelAvatarUrl={collection.channel.channelAvatarUrl ?? ""}
        />
      </div>
    </PrivatePage>
  );
}

function CollectionDetailPageLoading() {
  return (
    <PrivatePage pageTitle="Loading Collection">
      <div>
        <p>Loading collection details...</p>
      </div>
    </PrivatePage>
  );
}
