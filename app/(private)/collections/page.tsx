import { auth } from "@/auth";
import { getCollectionsByUserId } from "@/services/collectionService";
import { Suspense } from "react";
import { CollectionsList } from "./collections-list";

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    return <div>Not logged in</div>; // Or redirect to login page
  }
  const userId = session.user.id;

  // Wrap in Suspense.  This handles loading at the *route* level.
  return (
    <Suspense fallback={<CollectionsPageLoading />}>
      <CollectionsPageContent userId={userId} />
    </Suspense>
  );
}

// Separate component for the actual content, allows Suspense to work at route level
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

// Separate Loading component.  This keeps the main component cleaner.
function CollectionsPageLoading() {
  return (
    <div>
      <h1>My Collections</h1>
      <p>Loading collections...</p>
    </div>
  );
}

// const CollectionsPage = async () => {
//   const session = await auth();
//   const userId = session?.user?.id;

//   let collections: CollectionWithRelations[] = [];
//   if (userId) {
//     const collectionsResult = await getCollectionsByUserId(userId);

//     if (collectionsResult.success) {
//       collections = collectionsResult.data;
//     } else {
//       console.error("Error fetching collections:", collectionsResult.errors);
//     }
//   } else {
//     console.error(
//       "UserId is missing in CollectionsPage, cannot fetch collections."
//     );
//   }

//   return (
//     <PrivatePage pageTitle="My Collections">
//       <CollectionsList collections={collections} />
//     </PrivatePage>
//   );
// };

// export default CollectionsPage;
