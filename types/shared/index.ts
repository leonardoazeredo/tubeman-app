// ../tubeman-app/types/shared/index.ts

import React from "react";

export type Result<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      errors?: ValidationError[];
    };

export interface ValidationError {
  field: string;
  message: string;
}

export type PrivatePageProps<T extends object = object> = {
  pageTitle: string;
  children?: React.ReactNode;
} & T;

// Type guard function
export function isSuccess<T>(
  result: Result<T>
): result is { success: true; data: T } {
  return result.success;
}

export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Thumbnails {
  default?: Thumbnail;
  medium?: Thumbnail;
  high?: Thumbnail;
  standard?: Thumbnail;
  maxres?: Thumbnail;
  [key: string]: Thumbnail | undefined;
}

interface Localized {
  title: string;
  description: string;
}

type LiveBroadcastContent = "live" | "none" | "upcoming";

export interface Video {
  publishedAt?: Date;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  tags?: string[];
  categoryId: string;
  liveBroadcastContent: LiveBroadcastContent;
  defaultLanguage?: string;
  localized?: Localized;
  defaultAudioLanguage?: string;
}
