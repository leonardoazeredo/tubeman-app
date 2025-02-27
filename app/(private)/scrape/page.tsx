import VideosSearchForm from "@/app/ui/forms/videos-search-form";
import PrivatePage from "@/app/ui/pages/private-page";
import { Suspense } from "react";

export default function Collections() {
  return (
    <PrivatePage pageTitle="Scrape">
      <Suspense fallback="Loading...">
        <VideosSearchForm />
      </Suspense>
    </PrivatePage>
  );
}
