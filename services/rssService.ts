import { XMLParser, XMLValidator } from "fast-xml-parser";
import { Result, Video as SharedVideoType } from "@/types/shared";

/**
 * Fetches recent videos from a YouTube channel's RSS feed.
 * Note: Provides limited data and NO keyword filtering at the source.
 * @param channelName - The YouTube Channel ID.
 * @returns A promise resolving to a Result object containing an array of Video objects on success.
 */
export async function fetchRecentVideosFromRSS(
  channelName: string
): Promise<Result<SharedVideoType[]>> {
  const feedUrl = `https://www.youtube.com/feeds/videos.xml?user=${channelName.replaceAll(
    " ",
    ""
  )}`;
  console.log(`Attempting RSS fetch for channel ${channelName}: ${feedUrl}`);

  try {
    const response = await fetch(feedUrl, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch RSS feed: ${response.status} ${response.statusText}`
      );
    }
    const xmlData = await response.text();

    const validationResult = XMLValidator.validate(xmlData);
    if (validationResult !== true) {
      console.error(
        "Invalid XML received from RSS feed:",
        validationResult.err
      );
      throw new Error("Invalid XML format in RSS feed.");
    }

    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
    const jsonObj = parser.parse(xmlData);
    const entries = jsonObj?.feed?.entry;

    if (!Array.isArray(entries)) {
      console.log("No valid <entry> tags found in RSS feed.");
      return { success: true, data: [] };
    }

    const videos: SharedVideoType[] = entries
      .map((entry): SharedVideoType | null => {
        try {
          const videoId = entry["yt:videoId"];
          const title = entry.title;
          const publishedStr = entry.published;
          const description = entry["media:group"]?.["media:description"] || "";
          const thumbnailUrl =
            entry["media:group"]?.["media:thumbnail"]?.["@_url"] || "";

          if (
            !videoId ||
            typeof videoId !== "string" ||
            !title ||
            typeof title !== "string" ||
            !publishedStr ||
            typeof publishedStr !== "string"
          ) {
            console.warn(
              "Skipping RSS entry due to missing essential fields:",
              entry?.id
            );
            return null;
          }
          const publishedAt = new Date(publishedStr);
          if (isNaN(publishedAt.getTime())) {
            console.warn(
              "Skipping RSS entry due to invalid date:",
              publishedStr
            );
            return null;
          }

          return {
            id: "",
            title: title,
            url: videoId,
            description: description,
            thumbnailUrl: thumbnailUrl,
            publishedAt: publishedAt,
          };
        } catch (parseEntryError) {
          console.error(
            "Error parsing individual RSS entry:",
            parseEntryError,
            entry
          );
          return null;
        }
      })
      .filter((video): video is SharedVideoType => video !== null);

    console.log(
      `RSS fetch: Successfully parsed ${videos.length} videos for channel ${channelName}.`
    );
    return { success: true, data: videos };
  } catch (error: unknown) {
    console.error(
      `Error fetching or parsing RSS feed for channel ${channelName}:`,
      error
    );
    let message = "Failed to process RSS feed.";
    if (error instanceof Error) message = error.message;
    return { success: false, errors: [{ field: "rss", message }] };
  }
}
