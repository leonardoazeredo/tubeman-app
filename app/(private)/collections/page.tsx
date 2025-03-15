import { auth } from "@/auth";
import { getCollectionsByUserId } from "@/services/collectionService";
import { Suspense } from "react";
import { CollectionsList } from "./collections-list";

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Not logged in</div>;
  }
  const userId = session.user.id;

  return (
    <Suspense fallback={<CollectionsPageLoading />}>
      <CollectionsPageContent userId={userId} />
    </Suspense>
  );
}

async function CollectionsPageContent({ userId }: { userId: string }) {
  const collectionsResult = await getCollectionsByUserId(userId);

  if (!collectionsResult.success) {
    return (
      <div>
        Error loading collections: {collectionsResult.errors?.[0]?.message}
      </div>
    );
  }
  const collections = collectionsResult.data || [];

  return (
    <div>
      <h1>My Collections</h1>
      <CollectionsList collections={collections} />
    </div>
  );
}

function CollectionsPageLoading() {
  return (
    <div>
      <h1>My Collections</h1>
      <p>Loading collections...</p>
    </div>
  );
}
