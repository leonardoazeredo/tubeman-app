export interface YtInitialData {
  contents?: TwoColumnBrowseResultsRenderer;
}

export interface TwoColumnBrowseResultsRenderer {
  twoColumnBrowseResultsRenderer?: TwoColumnBrowseResultsRendererContent;
}

export interface TwoColumnBrowseResultsRendererContent {
  tabs?: Tab[];
}

export interface Tab {
  expandableTabRenderer?: ExpandableTabRenderer;
  tabRenderer?: TabRendererDetails;
}

export interface ExpandableTabRenderer {
  content?: Content;
}

export interface Content {
  sectionListRenderer?: SectionListRenderer;
}

export interface TabRendererDetails {
  title: string;
}

export interface SectionListRenderer {
  contents?: SectionContent[];
  continuations?: Continuation[];
}

export interface SectionContent {
  itemSectionRenderer?: ItemSectionRenderer;
}

export interface ItemSectionRenderer {
  contents?: ItemContent[];
}

export interface ItemContent {
  videoRenderer?: VideoRenderer;
}

export interface VideoRenderer {
  videoId?: string;
  playlistId?: string;
  title?: Title;
  descriptionSnippet?: DescriptionSnippet;
  thumbnail?: ThumbnailContainer;
  avatar?: AvatarContainer;
  longBylineText?: LongBylineTextContainer;
}

export interface LongBylineTextContainer {
  runs?: NavigationEndpoint[];
}

export interface NavigationEndpoint {
  navigationEndpoint: BrowseEndpoint;
}
export interface BrowseEndpoint {
  browseEndpoint: BrowseId;
}

export interface BrowseId {
  browseId: string;
}

export interface Title {
  runs?: Array<{ text: string }>;
}

export interface DescriptionSnippet {
  runs?: Array<{ text: string }>;
}

export interface ThumbnailContainer {
  thumbnails?: Thumbnail[];
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface AvatarContainer {
  decoratedAvatarViewModel?: DecoratedAvatarViewModel;
}

export interface DecoratedAvatarViewModel {
  avatar?: Avatar;
}

export interface Avatar {
  avatarViewModel?: AvatarViewModel;
}

export interface AvatarViewModel {
  image?: Image;
}

export interface Image {
  sources?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
}

export interface Continuation {
  nextContinuationData?: NextContinuationData;
}

export interface NextContinuationData {
  continuation: string;
}
