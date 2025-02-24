import VideosSearchForm from "@/app/ui/forms/scrape-videos-form";
import PrivatePage from "@/app/ui/pages/private-page";

export default function Collections() {
  return (
    <PrivatePage pageTitle="Scrape">
      <VideosSearchForm />
    </PrivatePage>
  );
}
