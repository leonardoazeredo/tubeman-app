import { CollectionsList } from "@/app/ui/collections/collections-list";
import PrivatePage from "@/app/ui/pages/private-page";
import { auth } from "@/auth";
import { getCollectionsByUserId } from "@/services/collectionService";
import { DbCollection } from "@/types/db";

const CollectionsPage = async () => {
  const session = await auth();
  const userId = session?.user?.id;

  let collections: DbCollection[] = [];
  if (userId) {
    const collectionsResult = await getCollectionsByUserId(userId);

    if (collectionsResult.success) {
      collections = collectionsResult.data;
    } else {
      console.error("Error fetching collections:", collectionsResult.errors);
    }
  } else {
    console.error(
      "UserId is missing in CollectionsPage, cannot fetch collections."
    );
  }

  return (
    <PrivatePage pageTitle="My Collections">
      <CollectionsList collections={collections} />
    </PrivatePage>
  );
};

export default CollectionsPage;
