import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const UserScalarFieldEnumSchema = z.enum(['id','email','password','userName','createdAt','updatedAt']);

export const CollectionScalarFieldEnumSchema = z.enum(['id','name','slug','userId','channelId','createdAt','updatedAt']);

export const ChannelScalarFieldEnumSchema = z.enum(['id','name','channelId','channelAvatarUrl','createdAt','updatedAt','userId']);

export const VideoScalarFieldEnumSchema = z.enum(['id','title','url','description','thumbnailUrl','publishedAt','channelId']);

export const CollectionKeywordScalarFieldEnumSchema = z.enum(['collectionId','keywordId','assignedAt']);

export const CollectionVideoScalarFieldEnumSchema = z.enum(['collectionId','videoId','assignedAt']);

export const KeywordScalarFieldEnumSchema = z.enum(['id','text','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string(),
  password: z.string(),
  userName: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// COLLECTION SCHEMA
/////////////////////////////////////////

export const CollectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  slug: z.string().nullable(),
  userId: z.string(),
  channelId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Collection = z.infer<typeof CollectionSchema>

/////////////////////////////////////////
// CHANNEL SCHEMA
/////////////////////////////////////////

export const ChannelSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  userId: z.string().nullable(),
})

export type Channel = z.infer<typeof ChannelSchema>

/////////////////////////////////////////
// VIDEO SCHEMA
/////////////////////////////////////////

export const VideoSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().nullable(),
  channelId: z.string(),
})

export type Video = z.infer<typeof VideoSchema>

/////////////////////////////////////////
// COLLECTION KEYWORD SCHEMA
/////////////////////////////////////////

export const CollectionKeywordSchema = z.object({
  collectionId: z.string(),
  keywordId: z.string(),
  assignedAt: z.coerce.date(),
})

export type CollectionKeyword = z.infer<typeof CollectionKeywordSchema>

/////////////////////////////////////////
// COLLECTION VIDEO SCHEMA
/////////////////////////////////////////

export const CollectionVideoSchema = z.object({
  collectionId: z.string(),
  videoId: z.string(),
  assignedAt: z.coerce.date(),
})

export type CollectionVideo = z.infer<typeof CollectionVideoSchema>

/////////////////////////////////////////
// KEYWORD SCHEMA
/////////////////////////////////////////

export const KeywordSchema = z.object({
  id: z.string().uuid(),
  text: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Keyword = z.infer<typeof KeywordSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
  collections: z.union([z.boolean(),z.lazy(() => CollectionFindManyArgsSchema)]).optional(),
  channels: z.union([z.boolean(),z.lazy(() => ChannelFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  collections: z.boolean().optional(),
  channels: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  userName: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  collections: z.union([z.boolean(),z.lazy(() => CollectionFindManyArgsSchema)]).optional(),
  channels: z.union([z.boolean(),z.lazy(() => ChannelFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COLLECTION
//------------------------------------------------------

export const CollectionIncludeSchema: z.ZodType<Prisma.CollectionInclude> = z.object({
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  channel: z.union([z.boolean(),z.lazy(() => ChannelArgsSchema)]).optional(),
  collectionKeywords: z.union([z.boolean(),z.lazy(() => CollectionKeywordFindManyArgsSchema)]).optional(),
  collectionVideos: z.union([z.boolean(),z.lazy(() => CollectionVideoFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CollectionCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const CollectionArgsSchema: z.ZodType<Prisma.CollectionDefaultArgs> = z.object({
  select: z.lazy(() => CollectionSelectSchema).optional(),
  include: z.lazy(() => CollectionIncludeSchema).optional(),
}).strict();

export const CollectionCountOutputTypeArgsSchema: z.ZodType<Prisma.CollectionCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => CollectionCountOutputTypeSelectSchema).nullish(),
}).strict();

export const CollectionCountOutputTypeSelectSchema: z.ZodType<Prisma.CollectionCountOutputTypeSelect> = z.object({
  collectionKeywords: z.boolean().optional(),
  collectionVideos: z.boolean().optional(),
}).strict();

export const CollectionSelectSchema: z.ZodType<Prisma.CollectionSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  slug: z.boolean().optional(),
  userId: z.boolean().optional(),
  channelId: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  channel: z.union([z.boolean(),z.lazy(() => ChannelArgsSchema)]).optional(),
  collectionKeywords: z.union([z.boolean(),z.lazy(() => CollectionKeywordFindManyArgsSchema)]).optional(),
  collectionVideos: z.union([z.boolean(),z.lazy(() => CollectionVideoFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => CollectionCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CHANNEL
//------------------------------------------------------

export const ChannelIncludeSchema: z.ZodType<Prisma.ChannelInclude> = z.object({
  videos: z.union([z.boolean(),z.lazy(() => VideoFindManyArgsSchema)]).optional(),
  collections: z.union([z.boolean(),z.lazy(() => CollectionFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChannelCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const ChannelArgsSchema: z.ZodType<Prisma.ChannelDefaultArgs> = z.object({
  select: z.lazy(() => ChannelSelectSchema).optional(),
  include: z.lazy(() => ChannelIncludeSchema).optional(),
}).strict();

export const ChannelCountOutputTypeArgsSchema: z.ZodType<Prisma.ChannelCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ChannelCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ChannelCountOutputTypeSelectSchema: z.ZodType<Prisma.ChannelCountOutputTypeSelect> = z.object({
  videos: z.boolean().optional(),
  collections: z.boolean().optional(),
}).strict();

export const ChannelSelectSchema: z.ZodType<Prisma.ChannelSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  channelId: z.boolean().optional(),
  channelAvatarUrl: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  videos: z.union([z.boolean(),z.lazy(() => VideoFindManyArgsSchema)]).optional(),
  collections: z.union([z.boolean(),z.lazy(() => CollectionFindManyArgsSchema)]).optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ChannelCountOutputTypeArgsSchema)]).optional(),
}).strict()

// VIDEO
//------------------------------------------------------

export const VideoIncludeSchema: z.ZodType<Prisma.VideoInclude> = z.object({
  channel: z.union([z.boolean(),z.lazy(() => ChannelArgsSchema)]).optional(),
  collections: z.union([z.boolean(),z.lazy(() => CollectionVideoFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VideoCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const VideoArgsSchema: z.ZodType<Prisma.VideoDefaultArgs> = z.object({
  select: z.lazy(() => VideoSelectSchema).optional(),
  include: z.lazy(() => VideoIncludeSchema).optional(),
}).strict();

export const VideoCountOutputTypeArgsSchema: z.ZodType<Prisma.VideoCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => VideoCountOutputTypeSelectSchema).nullish(),
}).strict();

export const VideoCountOutputTypeSelectSchema: z.ZodType<Prisma.VideoCountOutputTypeSelect> = z.object({
  collections: z.boolean().optional(),
}).strict();

export const VideoSelectSchema: z.ZodType<Prisma.VideoSelect> = z.object({
  id: z.boolean().optional(),
  title: z.boolean().optional(),
  url: z.boolean().optional(),
  description: z.boolean().optional(),
  thumbnailUrl: z.boolean().optional(),
  publishedAt: z.boolean().optional(),
  channelId: z.boolean().optional(),
  channel: z.union([z.boolean(),z.lazy(() => ChannelArgsSchema)]).optional(),
  collections: z.union([z.boolean(),z.lazy(() => CollectionVideoFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => VideoCountOutputTypeArgsSchema)]).optional(),
}).strict()

// COLLECTION KEYWORD
//------------------------------------------------------

export const CollectionKeywordIncludeSchema: z.ZodType<Prisma.CollectionKeywordInclude> = z.object({
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  keyword: z.union([z.boolean(),z.lazy(() => KeywordArgsSchema)]).optional(),
}).strict()

export const CollectionKeywordArgsSchema: z.ZodType<Prisma.CollectionKeywordDefaultArgs> = z.object({
  select: z.lazy(() => CollectionKeywordSelectSchema).optional(),
  include: z.lazy(() => CollectionKeywordIncludeSchema).optional(),
}).strict();

export const CollectionKeywordSelectSchema: z.ZodType<Prisma.CollectionKeywordSelect> = z.object({
  collectionId: z.boolean().optional(),
  keywordId: z.boolean().optional(),
  assignedAt: z.boolean().optional(),
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  keyword: z.union([z.boolean(),z.lazy(() => KeywordArgsSchema)]).optional(),
}).strict()

// COLLECTION VIDEO
//------------------------------------------------------

export const CollectionVideoIncludeSchema: z.ZodType<Prisma.CollectionVideoInclude> = z.object({
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  video: z.union([z.boolean(),z.lazy(() => VideoArgsSchema)]).optional(),
}).strict()

export const CollectionVideoArgsSchema: z.ZodType<Prisma.CollectionVideoDefaultArgs> = z.object({
  select: z.lazy(() => CollectionVideoSelectSchema).optional(),
  include: z.lazy(() => CollectionVideoIncludeSchema).optional(),
}).strict();

export const CollectionVideoSelectSchema: z.ZodType<Prisma.CollectionVideoSelect> = z.object({
  collectionId: z.boolean().optional(),
  videoId: z.boolean().optional(),
  assignedAt: z.boolean().optional(),
  collection: z.union([z.boolean(),z.lazy(() => CollectionArgsSchema)]).optional(),
  video: z.union([z.boolean(),z.lazy(() => VideoArgsSchema)]).optional(),
}).strict()

// KEYWORD
//------------------------------------------------------

export const KeywordIncludeSchema: z.ZodType<Prisma.KeywordInclude> = z.object({
  collections: z.union([z.boolean(),z.lazy(() => CollectionKeywordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => KeywordCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const KeywordArgsSchema: z.ZodType<Prisma.KeywordDefaultArgs> = z.object({
  select: z.lazy(() => KeywordSelectSchema).optional(),
  include: z.lazy(() => KeywordIncludeSchema).optional(),
}).strict();

export const KeywordCountOutputTypeArgsSchema: z.ZodType<Prisma.KeywordCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => KeywordCountOutputTypeSelectSchema).nullish(),
}).strict();

export const KeywordCountOutputTypeSelectSchema: z.ZodType<Prisma.KeywordCountOutputTypeSelect> = z.object({
  collections: z.boolean().optional(),
}).strict();

export const KeywordSelectSchema: z.ZodType<Prisma.KeywordSelect> = z.object({
  id: z.boolean().optional(),
  text: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  collections: z.union([z.boolean(),z.lazy(() => CollectionKeywordFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => KeywordCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.object({
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userName: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collections: z.lazy(() => CollectionListRelationFilterSchema).optional(),
  channels: z.lazy(() => ChannelListRelationFilterSchema).optional()
}).strict();

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  collections: z.lazy(() => CollectionOrderByRelationAggregateInputSchema).optional(),
  channels: z.lazy(() => ChannelOrderByRelationAggregateInputSchema).optional()
}).strict();

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    email: z.string(),
    userName: z.string()
  }),
  z.object({
    id: z.string().uuid(),
    email: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
    userName: z.string(),
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    email: z.string(),
    userName: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
  z.object({
    userName: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  email: z.string().optional(),
  userName: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema),z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collections: z.lazy(() => CollectionListRelationFilterSchema).optional(),
  channels: z.lazy(() => ChannelListRelationFilterSchema).optional()
}).strict());

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userName: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional()
}).strict();

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema),z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  userName: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CollectionWhereInputSchema: z.ZodType<Prisma.CollectionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionWhereInputSchema),z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionWhereInputSchema),z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelScalarRelationFilterSchema),z.lazy(() => ChannelWhereInputSchema) ]).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordListRelationFilterSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoListRelationFilterSchema).optional()
}).strict();

export const CollectionOrderByWithRelationInputSchema: z.ZodType<Prisma.CollectionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
  channel: z.lazy(() => ChannelOrderByWithRelationInputSchema).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordOrderByRelationAggregateInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoOrderByRelationAggregateInputSchema).optional()
}).strict();

export const CollectionWhereUniqueInputSchema: z.ZodType<Prisma.CollectionWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    slug: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    slug: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  slug: z.string().optional(),
  AND: z.union([ z.lazy(() => CollectionWhereInputSchema),z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionWhereInputSchema),z.lazy(() => CollectionWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  userId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional(),
  channel: z.union([ z.lazy(() => ChannelScalarRelationFilterSchema),z.lazy(() => ChannelWhereInputSchema) ]).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordListRelationFilterSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoListRelationFilterSchema).optional()
}).strict());

export const CollectionOrderByWithAggregationInputSchema: z.ZodType<Prisma.CollectionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CollectionCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CollectionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CollectionMinOrderByAggregateInputSchema).optional()
}).strict();

export const CollectionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CollectionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema),z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema),z.lazy(() => CollectionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  channelId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ChannelWhereInputSchema: z.ZodType<Prisma.ChannelWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChannelWhereInputSchema),z.lazy(() => ChannelWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChannelWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChannelWhereInputSchema),z.lazy(() => ChannelWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channelAvatarUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => UuidNullableFilterSchema),z.string() ]).optional().nullable(),
  videos: z.lazy(() => VideoListRelationFilterSchema).optional(),
  collections: z.lazy(() => CollectionListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict();

export const ChannelOrderByWithRelationInputSchema: z.ZodType<Prisma.ChannelOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  channelAvatarUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  videos: z.lazy(() => VideoOrderByRelationAggregateInputSchema).optional(),
  collections: z.lazy(() => CollectionOrderByRelationAggregateInputSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional()
}).strict();

export const ChannelWhereUniqueInputSchema: z.ZodType<Prisma.ChannelWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    channelId: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    channelId: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  channelId: z.string().optional(),
  AND: z.union([ z.lazy(() => ChannelWhereInputSchema),z.lazy(() => ChannelWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChannelWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChannelWhereInputSchema),z.lazy(() => ChannelWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channelAvatarUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => UuidNullableFilterSchema),z.string() ]).optional().nullable(),
  videos: z.lazy(() => VideoListRelationFilterSchema).optional(),
  collections: z.lazy(() => CollectionListRelationFilterSchema).optional(),
  user: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema),z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}).strict());

export const ChannelOrderByWithAggregationInputSchema: z.ZodType<Prisma.ChannelOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  channelAvatarUrl: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => ChannelCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ChannelMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ChannelMinOrderByAggregateInputSchema).optional()
}).strict();

export const ChannelScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ChannelScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => ChannelScalarWhereWithAggregatesInputSchema),z.lazy(() => ChannelScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChannelScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChannelScalarWhereWithAggregatesInputSchema),z.lazy(() => ChannelScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  channelId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  channelAvatarUrl: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => UuidNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const VideoWhereInputSchema: z.ZodType<Prisma.VideoWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VideoWhereInputSchema),z.lazy(() => VideoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VideoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VideoWhereInputSchema),z.lazy(() => VideoWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  thumbnailUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channel: z.union([ z.lazy(() => ChannelScalarRelationFilterSchema),z.lazy(() => ChannelWhereInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionVideoListRelationFilterSchema).optional()
}).strict();

export const VideoOrderByWithRelationInputSchema: z.ZodType<Prisma.VideoOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  channel: z.lazy(() => ChannelOrderByWithRelationInputSchema).optional(),
  collections: z.lazy(() => CollectionVideoOrderByRelationAggregateInputSchema).optional()
}).strict();

export const VideoWhereUniqueInputSchema: z.ZodType<Prisma.VideoWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    url: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    url: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  url: z.string().optional(),
  AND: z.union([ z.lazy(() => VideoWhereInputSchema),z.lazy(() => VideoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VideoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VideoWhereInputSchema),z.lazy(() => VideoWhereInputSchema).array() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  thumbnailUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channel: z.union([ z.lazy(() => ChannelScalarRelationFilterSchema),z.lazy(() => ChannelWhereInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionVideoListRelationFilterSchema).optional()
}).strict());

export const VideoOrderByWithAggregationInputSchema: z.ZodType<Prisma.VideoOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => VideoCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => VideoMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => VideoMinOrderByAggregateInputSchema).optional()
}).strict();

export const VideoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.VideoScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => VideoScalarWhereWithAggregatesInputSchema),z.lazy(() => VideoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => VideoScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VideoScalarWhereWithAggregatesInputSchema),z.lazy(() => VideoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  thumbnailUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
  channelId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const CollectionKeywordWhereInputSchema: z.ZodType<Prisma.CollectionKeywordWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionKeywordWhereInputSchema),z.lazy(() => CollectionKeywordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionKeywordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionKeywordWhereInputSchema),z.lazy(() => CollectionKeywordWhereInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  keywordId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema),z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  keyword: z.union([ z.lazy(() => KeywordScalarRelationFilterSchema),z.lazy(() => KeywordWhereInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordOrderByWithRelationInputSchema: z.ZodType<Prisma.CollectionKeywordOrderByWithRelationInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  keywordId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional(),
  collection: z.lazy(() => CollectionOrderByWithRelationInputSchema).optional(),
  keyword: z.lazy(() => KeywordOrderByWithRelationInputSchema).optional()
}).strict();

export const CollectionKeywordWhereUniqueInputSchema: z.ZodType<Prisma.CollectionKeywordWhereUniqueInput> = z.object({
  collectionId_keywordId: z.lazy(() => CollectionKeywordCollectionIdKeywordIdCompoundUniqueInputSchema)
})
.and(z.object({
  collectionId_keywordId: z.lazy(() => CollectionKeywordCollectionIdKeywordIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CollectionKeywordWhereInputSchema),z.lazy(() => CollectionKeywordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionKeywordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionKeywordWhereInputSchema),z.lazy(() => CollectionKeywordWhereInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  keywordId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema),z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  keyword: z.union([ z.lazy(() => KeywordScalarRelationFilterSchema),z.lazy(() => KeywordWhereInputSchema) ]).optional(),
}).strict());

export const CollectionKeywordOrderByWithAggregationInputSchema: z.ZodType<Prisma.CollectionKeywordOrderByWithAggregationInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  keywordId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CollectionKeywordCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CollectionKeywordMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CollectionKeywordMinOrderByAggregateInputSchema).optional()
}).strict();

export const CollectionKeywordScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CollectionKeywordScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionKeywordScalarWhereWithAggregatesInputSchema),z.lazy(() => CollectionKeywordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionKeywordScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionKeywordScalarWhereWithAggregatesInputSchema),z.lazy(() => CollectionKeywordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  keywordId: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CollectionVideoWhereInputSchema: z.ZodType<Prisma.CollectionVideoWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionVideoWhereInputSchema),z.lazy(() => CollectionVideoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionVideoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionVideoWhereInputSchema),z.lazy(() => CollectionVideoWhereInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  videoId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema),z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  video: z.union([ z.lazy(() => VideoScalarRelationFilterSchema),z.lazy(() => VideoWhereInputSchema) ]).optional(),
}).strict();

export const CollectionVideoOrderByWithRelationInputSchema: z.ZodType<Prisma.CollectionVideoOrderByWithRelationInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  videoId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional(),
  collection: z.lazy(() => CollectionOrderByWithRelationInputSchema).optional(),
  video: z.lazy(() => VideoOrderByWithRelationInputSchema).optional()
}).strict();

export const CollectionVideoWhereUniqueInputSchema: z.ZodType<Prisma.CollectionVideoWhereUniqueInput> = z.object({
  collectionId_videoId: z.lazy(() => CollectionVideoCollectionIdVideoIdCompoundUniqueInputSchema)
})
.and(z.object({
  collectionId_videoId: z.lazy(() => CollectionVideoCollectionIdVideoIdCompoundUniqueInputSchema).optional(),
  AND: z.union([ z.lazy(() => CollectionVideoWhereInputSchema),z.lazy(() => CollectionVideoWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionVideoWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionVideoWhereInputSchema),z.lazy(() => CollectionVideoWhereInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  videoId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collection: z.union([ z.lazy(() => CollectionScalarRelationFilterSchema),z.lazy(() => CollectionWhereInputSchema) ]).optional(),
  video: z.union([ z.lazy(() => VideoScalarRelationFilterSchema),z.lazy(() => VideoWhereInputSchema) ]).optional(),
}).strict());

export const CollectionVideoOrderByWithAggregationInputSchema: z.ZodType<Prisma.CollectionVideoOrderByWithAggregationInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  videoId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CollectionVideoCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CollectionVideoMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CollectionVideoMinOrderByAggregateInputSchema).optional()
}).strict();

export const CollectionVideoScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CollectionVideoScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionVideoScalarWhereWithAggregatesInputSchema),z.lazy(() => CollectionVideoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionVideoScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionVideoScalarWhereWithAggregatesInputSchema),z.lazy(() => CollectionVideoScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  videoId: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const KeywordWhereInputSchema: z.ZodType<Prisma.KeywordWhereInput> = z.object({
  AND: z.union([ z.lazy(() => KeywordWhereInputSchema),z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeywordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeywordWhereInputSchema),z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  text: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collections: z.lazy(() => CollectionKeywordListRelationFilterSchema).optional()
}).strict();

export const KeywordOrderByWithRelationInputSchema: z.ZodType<Prisma.KeywordOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  collections: z.lazy(() => CollectionKeywordOrderByRelationAggregateInputSchema).optional()
}).strict();

export const KeywordWhereUniqueInputSchema: z.ZodType<Prisma.KeywordWhereUniqueInput> = z.union([
  z.object({
    id: z.string().uuid(),
    text: z.string()
  }),
  z.object({
    id: z.string().uuid(),
  }),
  z.object({
    text: z.string(),
  }),
])
.and(z.object({
  id: z.string().uuid().optional(),
  text: z.string().optional(),
  AND: z.union([ z.lazy(() => KeywordWhereInputSchema),z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeywordWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeywordWhereInputSchema),z.lazy(() => KeywordWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  collections: z.lazy(() => CollectionKeywordListRelationFilterSchema).optional()
}).strict());

export const KeywordOrderByWithAggregationInputSchema: z.ZodType<Prisma.KeywordOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => KeywordCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => KeywordMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => KeywordMinOrderByAggregateInputSchema).optional()
}).strict();

export const KeywordScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.KeywordScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema),z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema),z.lazy(() => KeywordScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidWithAggregatesFilterSchema),z.string() ]).optional(),
  text: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  password: z.string(),
  userName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collections: z.lazy(() => CollectionCreateNestedManyWithoutUserInputSchema).optional(),
  channels: z.lazy(() => ChannelCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  password: z.string(),
  userName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collections: z.lazy(() => CollectionUncheckedCreateNestedManyWithoutUserInputSchema).optional(),
  channels: z.lazy(() => ChannelUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionUpdateManyWithoutUserNestedInputSchema).optional(),
  channels: z.lazy(() => ChannelUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional(),
  channels: z.lazy(() => ChannelUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  password: z.string(),
  userName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionCreateInputSchema: z.ZodType<Prisma.CollectionCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputSchema),
  channel: z.lazy(() => ChannelCreateNestedOneWithoutCollectionsInputSchema),
  collectionKeywords: z.lazy(() => CollectionKeywordCreateNestedManyWithoutCollectionInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionUncheckedCreateInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  userId: z.string(),
  channelId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionUpdateInputSchema: z.ZodType<Prisma.CollectionUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  channel: z.lazy(() => ChannelUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUpdateManyWithoutCollectionNestedInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionUncheckedUpdateInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionCreateManyInputSchema: z.ZodType<Prisma.CollectionCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  userId: z.string(),
  channelId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CollectionUpdateManyMutationInputSchema: z.ZodType<Prisma.CollectionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChannelCreateInputSchema: z.ZodType<Prisma.ChannelCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  videos: z.lazy(() => VideoCreateNestedManyWithoutChannelInputSchema).optional(),
  collections: z.lazy(() => CollectionCreateNestedManyWithoutChannelInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutChannelsInputSchema).optional()
}).strict();

export const ChannelUncheckedCreateInputSchema: z.ZodType<Prisma.ChannelUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string().optional().nullable(),
  videos: z.lazy(() => VideoUncheckedCreateNestedManyWithoutChannelInputSchema).optional(),
  collections: z.lazy(() => CollectionUncheckedCreateNestedManyWithoutChannelInputSchema).optional()
}).strict();

export const ChannelUpdateInputSchema: z.ZodType<Prisma.ChannelUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  videos: z.lazy(() => VideoUpdateManyWithoutChannelNestedInputSchema).optional(),
  collections: z.lazy(() => CollectionUpdateManyWithoutChannelNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutChannelsNestedInputSchema).optional()
}).strict();

export const ChannelUncheckedUpdateInputSchema: z.ZodType<Prisma.ChannelUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  videos: z.lazy(() => VideoUncheckedUpdateManyWithoutChannelNestedInputSchema).optional(),
  collections: z.lazy(() => CollectionUncheckedUpdateManyWithoutChannelNestedInputSchema).optional()
}).strict();

export const ChannelCreateManyInputSchema: z.ZodType<Prisma.ChannelCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string().optional().nullable()
}).strict();

export const ChannelUpdateManyMutationInputSchema: z.ZodType<Prisma.ChannelUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChannelUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ChannelUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VideoCreateInputSchema: z.ZodType<Prisma.VideoCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable(),
  channel: z.lazy(() => ChannelCreateNestedOneWithoutVideosInputSchema),
  collections: z.lazy(() => CollectionVideoCreateNestedManyWithoutVideoInputSchema).optional()
}).strict();

export const VideoUncheckedCreateInputSchema: z.ZodType<Prisma.VideoUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable(),
  channelId: z.string(),
  collections: z.lazy(() => CollectionVideoUncheckedCreateNestedManyWithoutVideoInputSchema).optional()
}).strict();

export const VideoUpdateInputSchema: z.ZodType<Prisma.VideoUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  channel: z.lazy(() => ChannelUpdateOneRequiredWithoutVideosNestedInputSchema).optional(),
  collections: z.lazy(() => CollectionVideoUpdateManyWithoutVideoNestedInputSchema).optional()
}).strict();

export const VideoUncheckedUpdateInputSchema: z.ZodType<Prisma.VideoUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutVideoNestedInputSchema).optional()
}).strict();

export const VideoCreateManyInputSchema: z.ZodType<Prisma.VideoCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable(),
  channelId: z.string()
}).strict();

export const VideoUpdateManyMutationInputSchema: z.ZodType<Prisma.VideoUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const VideoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.VideoUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordCreateInputSchema: z.ZodType<Prisma.CollectionKeywordCreateInput> = z.object({
  assignedAt: z.coerce.date().optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutCollectionKeywordsInputSchema),
  keyword: z.lazy(() => KeywordCreateNestedOneWithoutCollectionsInputSchema)
}).strict();

export const CollectionKeywordUncheckedCreateInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedCreateInput> = z.object({
  collectionId: z.string(),
  keywordId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionKeywordUpdateInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutCollectionKeywordsNestedInputSchema).optional(),
  keyword: z.lazy(() => KeywordUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional()
}).strict();

export const CollectionKeywordUncheckedUpdateInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keywordId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordCreateManyInputSchema: z.ZodType<Prisma.CollectionKeywordCreateManyInput> = z.object({
  collectionId: z.string(),
  keywordId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionKeywordUpdateManyMutationInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateManyMutationInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateManyInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  keywordId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionVideoCreateInputSchema: z.ZodType<Prisma.CollectionVideoCreateInput> = z.object({
  assignedAt: z.coerce.date().optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutCollectionVideosInputSchema),
  video: z.lazy(() => VideoCreateNestedOneWithoutCollectionsInputSchema)
}).strict();

export const CollectionVideoUncheckedCreateInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedCreateInput> = z.object({
  collectionId: z.string(),
  videoId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionVideoUpdateInputSchema: z.ZodType<Prisma.CollectionVideoUpdateInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutCollectionVideosNestedInputSchema).optional(),
  video: z.lazy(() => VideoUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional()
}).strict();

export const CollectionVideoUncheckedUpdateInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  videoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionVideoCreateManyInputSchema: z.ZodType<Prisma.CollectionVideoCreateManyInput> = z.object({
  collectionId: z.string(),
  videoId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionVideoUpdateManyMutationInputSchema: z.ZodType<Prisma.CollectionVideoUpdateManyMutationInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionVideoUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateManyInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  videoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KeywordCreateInputSchema: z.ZodType<Prisma.KeywordCreateInput> = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collections: z.lazy(() => CollectionKeywordCreateNestedManyWithoutKeywordInputSchema).optional()
}).strict();

export const KeywordUncheckedCreateInputSchema: z.ZodType<Prisma.KeywordUncheckedCreateInput> = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collections: z.lazy(() => CollectionKeywordUncheckedCreateNestedManyWithoutKeywordInputSchema).optional()
}).strict();

export const KeywordUpdateInputSchema: z.ZodType<Prisma.KeywordUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionKeywordUpdateManyWithoutKeywordNestedInputSchema).optional()
}).strict();

export const KeywordUncheckedUpdateInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionKeywordUncheckedUpdateManyWithoutKeywordNestedInputSchema).optional()
}).strict();

export const KeywordCreateManyInputSchema: z.ZodType<Prisma.KeywordCreateManyInput> = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const KeywordUpdateManyMutationInputSchema: z.ZodType<Prisma.KeywordUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KeywordUncheckedUpdateManyInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const UuidFilterSchema: z.ZodType<Prisma.UuidFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const CollectionListRelationFilterSchema: z.ZodType<Prisma.CollectionListRelationFilter> = z.object({
  every: z.lazy(() => CollectionWhereInputSchema).optional(),
  some: z.lazy(() => CollectionWhereInputSchema).optional(),
  none: z.lazy(() => CollectionWhereInputSchema).optional()
}).strict();

export const ChannelListRelationFilterSchema: z.ZodType<Prisma.ChannelListRelationFilter> = z.object({
  every: z.lazy(() => ChannelWhereInputSchema).optional(),
  some: z.lazy(() => ChannelWhereInputSchema).optional(),
  none: z.lazy(() => ChannelWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const CollectionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CollectionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChannelOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ChannelOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  userName: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UuidWithAggregatesFilterSchema: z.ZodType<Prisma.UuidWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const ChannelScalarRelationFilterSchema: z.ZodType<Prisma.ChannelScalarRelationFilter> = z.object({
  is: z.lazy(() => ChannelWhereInputSchema).optional(),
  isNot: z.lazy(() => ChannelWhereInputSchema).optional()
}).strict();

export const CollectionKeywordListRelationFilterSchema: z.ZodType<Prisma.CollectionKeywordListRelationFilter> = z.object({
  every: z.lazy(() => CollectionKeywordWhereInputSchema).optional(),
  some: z.lazy(() => CollectionKeywordWhereInputSchema).optional(),
  none: z.lazy(() => CollectionKeywordWhereInputSchema).optional()
}).strict();

export const CollectionVideoListRelationFilterSchema: z.ZodType<Prisma.CollectionVideoListRelationFilter> = z.object({
  every: z.lazy(() => CollectionVideoWhereInputSchema).optional(),
  some: z.lazy(() => CollectionVideoWhereInputSchema).optional(),
  none: z.lazy(() => CollectionVideoWhereInputSchema).optional()
}).strict();

export const CollectionKeywordOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CollectionKeywordOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionVideoOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CollectionVideoOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionCountOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionMinOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  slug: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UuidNullableFilterSchema: z.ZodType<Prisma.UuidNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const VideoListRelationFilterSchema: z.ZodType<Prisma.VideoListRelationFilter> = z.object({
  every: z.lazy(() => VideoWhereInputSchema).optional(),
  some: z.lazy(() => VideoWhereInputSchema).optional(),
  none: z.lazy(() => VideoWhereInputSchema).optional()
}).strict();

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.object({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable()
}).strict();

export const VideoOrderByRelationAggregateInputSchema: z.ZodType<Prisma.VideoOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChannelCountOrderByAggregateInputSchema: z.ZodType<Prisma.ChannelCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  channelAvatarUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChannelMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ChannelMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  channelAvatarUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const ChannelMinOrderByAggregateInputSchema: z.ZodType<Prisma.ChannelMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional(),
  channelAvatarUrl: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const UuidNullableWithAggregatesFilterSchema: z.ZodType<Prisma.UuidNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const VideoCountOrderByAggregateInputSchema: z.ZodType<Prisma.VideoCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VideoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.VideoMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VideoMinOrderByAggregateInputSchema: z.ZodType<Prisma.VideoMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  title: z.lazy(() => SortOrderSchema).optional(),
  url: z.lazy(() => SortOrderSchema).optional(),
  description: z.lazy(() => SortOrderSchema).optional(),
  thumbnailUrl: z.lazy(() => SortOrderSchema).optional(),
  publishedAt: z.lazy(() => SortOrderSchema).optional(),
  channelId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const CollectionScalarRelationFilterSchema: z.ZodType<Prisma.CollectionScalarRelationFilter> = z.object({
  is: z.lazy(() => CollectionWhereInputSchema).optional(),
  isNot: z.lazy(() => CollectionWhereInputSchema).optional()
}).strict();

export const KeywordScalarRelationFilterSchema: z.ZodType<Prisma.KeywordScalarRelationFilter> = z.object({
  is: z.lazy(() => KeywordWhereInputSchema).optional(),
  isNot: z.lazy(() => KeywordWhereInputSchema).optional()
}).strict();

export const CollectionKeywordCollectionIdKeywordIdCompoundUniqueInputSchema: z.ZodType<Prisma.CollectionKeywordCollectionIdKeywordIdCompoundUniqueInput> = z.object({
  collectionId: z.string(),
  keywordId: z.string()
}).strict();

export const CollectionKeywordCountOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionKeywordCountOrderByAggregateInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  keywordId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionKeywordMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionKeywordMaxOrderByAggregateInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  keywordId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionKeywordMinOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionKeywordMinOrderByAggregateInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  keywordId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const VideoScalarRelationFilterSchema: z.ZodType<Prisma.VideoScalarRelationFilter> = z.object({
  is: z.lazy(() => VideoWhereInputSchema).optional(),
  isNot: z.lazy(() => VideoWhereInputSchema).optional()
}).strict();

export const CollectionVideoCollectionIdVideoIdCompoundUniqueInputSchema: z.ZodType<Prisma.CollectionVideoCollectionIdVideoIdCompoundUniqueInput> = z.object({
  collectionId: z.string(),
  videoId: z.string()
}).strict();

export const CollectionVideoCountOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionVideoCountOrderByAggregateInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  videoId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionVideoMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionVideoMaxOrderByAggregateInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  videoId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionVideoMinOrderByAggregateInputSchema: z.ZodType<Prisma.CollectionVideoMinOrderByAggregateInput> = z.object({
  collectionId: z.lazy(() => SortOrderSchema).optional(),
  videoId: z.lazy(() => SortOrderSchema).optional(),
  assignedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeywordCountOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeywordMaxOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const KeywordMinOrderByAggregateInputSchema: z.ZodType<Prisma.KeywordMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  text: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CollectionCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CollectionCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema),z.lazy(() => CollectionCreateWithoutUserInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ChannelCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ChannelCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutUserInputSchema),z.lazy(() => ChannelCreateWithoutUserInputSchema).array(),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChannelCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema),z.lazy(() => CollectionCreateWithoutUserInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const ChannelUncheckedCreateNestedManyWithoutUserInputSchema: z.ZodType<Prisma.ChannelUncheckedCreateNestedManyWithoutUserInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutUserInputSchema),z.lazy(() => ChannelCreateWithoutUserInputSchema).array(),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChannelCreateManyUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const CollectionUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CollectionUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema),z.lazy(() => CollectionCreateWithoutUserInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionScalarWhereInputSchema),z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChannelUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ChannelUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutUserInputSchema),z.lazy(() => ChannelCreateWithoutUserInputSchema).array(),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ChannelUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChannelUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChannelCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ChannelUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChannelUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ChannelUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ChannelUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ChannelScalarWhereInputSchema),z.lazy(() => ChannelScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema),z.lazy(() => CollectionCreateWithoutUserInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CollectionUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => CollectionUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => CollectionUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionScalarWhereInputSchema),z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChannelUncheckedUpdateManyWithoutUserNestedInputSchema: z.ZodType<Prisma.ChannelUncheckedUpdateManyWithoutUserNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutUserInputSchema),z.lazy(() => ChannelCreateWithoutUserInputSchema).array(),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema),z.lazy(() => ChannelCreateOrConnectWithoutUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ChannelUpsertWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChannelUpsertWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ChannelCreateManyUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ChannelWhereUniqueInputSchema),z.lazy(() => ChannelWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ChannelUpdateWithWhereUniqueWithoutUserInputSchema),z.lazy(() => ChannelUpdateWithWhereUniqueWithoutUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ChannelUpdateManyWithWhereWithoutUserInputSchema),z.lazy(() => ChannelUpdateManyWithWhereWithoutUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ChannelScalarWhereInputSchema),z.lazy(() => ChannelScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutCollectionsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutCollectionsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const ChannelCreateNestedOneWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelCreateNestedOneWithoutCollectionsInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutCollectionsInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChannelCreateOrConnectWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => ChannelWhereUniqueInputSchema).optional()
}).strict();

export const CollectionKeywordCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordCreateNestedManyWithoutCollectionInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionVideoCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoCreateNestedManyWithoutCollectionInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionKeywordUncheckedCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedCreateNestedManyWithoutCollectionInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionVideoUncheckedCreateNestedManyWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedCreateNestedManyWithoutCollectionInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyCollectionInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneRequiredWithoutCollectionsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutCollectionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutCollectionsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutCollectionsInputSchema),z.lazy(() => UserUpdateWithoutCollectionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputSchema) ]).optional(),
}).strict();

export const ChannelUpdateOneRequiredWithoutCollectionsNestedInputSchema: z.ZodType<Prisma.ChannelUpdateOneRequiredWithoutCollectionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutCollectionsInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChannelCreateOrConnectWithoutCollectionsInputSchema).optional(),
  upsert: z.lazy(() => ChannelUpsertWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => ChannelWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ChannelUpdateToOneWithWhereWithoutCollectionsInputSchema),z.lazy(() => ChannelUpdateWithoutCollectionsInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutCollectionsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateManyWithoutCollectionNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionKeywordScalarWhereInputSchema),z.lazy(() => CollectionKeywordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionVideoUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.CollectionVideoUpdateManyWithoutCollectionNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionVideoScalarWhereInputSchema),z.lazy(() => CollectionVideoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionKeywordUncheckedUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateManyWithoutCollectionNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionKeywordScalarWhereInputSchema),z.lazy(() => CollectionKeywordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionVideoUncheckedUpdateManyWithoutCollectionNestedInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateManyWithoutCollectionNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutCollectionInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyCollectionInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutCollectionInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutCollectionInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionVideoScalarWhereInputSchema),z.lazy(() => CollectionVideoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const VideoCreateNestedManyWithoutChannelInputSchema: z.ZodType<Prisma.VideoCreateNestedManyWithoutChannelInput> = z.object({
  create: z.union([ z.lazy(() => VideoCreateWithoutChannelInputSchema),z.lazy(() => VideoCreateWithoutChannelInputSchema).array(),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema),z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VideoCreateManyChannelInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionCreateNestedManyWithoutChannelInputSchema: z.ZodType<Prisma.CollectionCreateNestedManyWithoutChannelInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutChannelInputSchema),z.lazy(() => CollectionCreateWithoutChannelInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyChannelInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const UserCreateNestedOneWithoutChannelsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutChannelsInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutChannelsInputSchema),z.lazy(() => UserUncheckedCreateWithoutChannelsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutChannelsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional()
}).strict();

export const VideoUncheckedCreateNestedManyWithoutChannelInputSchema: z.ZodType<Prisma.VideoUncheckedCreateNestedManyWithoutChannelInput> = z.object({
  create: z.union([ z.lazy(() => VideoCreateWithoutChannelInputSchema),z.lazy(() => VideoCreateWithoutChannelInputSchema).array(),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema),z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VideoCreateManyChannelInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionUncheckedCreateNestedManyWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateNestedManyWithoutChannelInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutChannelInputSchema),z.lazy(() => CollectionCreateWithoutChannelInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyChannelInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const VideoUpdateManyWithoutChannelNestedInputSchema: z.ZodType<Prisma.VideoUpdateManyWithoutChannelNestedInput> = z.object({
  create: z.union([ z.lazy(() => VideoCreateWithoutChannelInputSchema),z.lazy(() => VideoCreateWithoutChannelInputSchema).array(),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema),z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VideoUpsertWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => VideoUpsertWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VideoCreateManyChannelInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VideoUpdateWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => VideoUpdateWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VideoUpdateManyWithWhereWithoutChannelInputSchema),z.lazy(() => VideoUpdateManyWithWhereWithoutChannelInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VideoScalarWhereInputSchema),z.lazy(() => VideoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionUpdateManyWithoutChannelNestedInputSchema: z.ZodType<Prisma.CollectionUpdateManyWithoutChannelNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutChannelInputSchema),z.lazy(() => CollectionCreateWithoutChannelInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionUpsertWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => CollectionUpsertWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyChannelInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => CollectionUpdateWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionUpdateManyWithWhereWithoutChannelInputSchema),z.lazy(() => CollectionUpdateManyWithWhereWithoutChannelInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionScalarWhereInputSchema),z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const UserUpdateOneWithoutChannelsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutChannelsNestedInput> = z.object({
  create: z.union([ z.lazy(() => UserCreateWithoutChannelsInputSchema),z.lazy(() => UserUncheckedCreateWithoutChannelsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutChannelsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutChannelsInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutChannelsInputSchema),z.lazy(() => UserUpdateWithoutChannelsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutChannelsInputSchema) ]).optional(),
}).strict();

export const VideoUncheckedUpdateManyWithoutChannelNestedInputSchema: z.ZodType<Prisma.VideoUncheckedUpdateManyWithoutChannelNestedInput> = z.object({
  create: z.union([ z.lazy(() => VideoCreateWithoutChannelInputSchema),z.lazy(() => VideoCreateWithoutChannelInputSchema).array(),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema),z.lazy(() => VideoCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => VideoUpsertWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => VideoUpsertWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => VideoCreateManyChannelInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => VideoWhereUniqueInputSchema),z.lazy(() => VideoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => VideoUpdateWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => VideoUpdateWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => VideoUpdateManyWithWhereWithoutChannelInputSchema),z.lazy(() => VideoUpdateManyWithWhereWithoutChannelInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => VideoScalarWhereInputSchema),z.lazy(() => VideoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionUncheckedUpdateManyWithoutChannelNestedInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyWithoutChannelNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutChannelInputSchema),z.lazy(() => CollectionCreateWithoutChannelInputSchema).array(),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema),z.lazy(() => CollectionCreateOrConnectWithoutChannelInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionUpsertWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => CollectionUpsertWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionCreateManyChannelInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionWhereUniqueInputSchema),z.lazy(() => CollectionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateWithWhereUniqueWithoutChannelInputSchema),z.lazy(() => CollectionUpdateWithWhereUniqueWithoutChannelInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionUpdateManyWithWhereWithoutChannelInputSchema),z.lazy(() => CollectionUpdateManyWithWhereWithoutChannelInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionScalarWhereInputSchema),z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const ChannelCreateNestedOneWithoutVideosInputSchema: z.ZodType<Prisma.ChannelCreateNestedOneWithoutVideosInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutVideosInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutVideosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChannelCreateOrConnectWithoutVideosInputSchema).optional(),
  connect: z.lazy(() => ChannelWhereUniqueInputSchema).optional()
}).strict();

export const CollectionVideoCreateNestedManyWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoCreateNestedManyWithoutVideoInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyVideoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionVideoUncheckedCreateNestedManyWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedCreateNestedManyWithoutVideoInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyVideoInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const ChannelUpdateOneRequiredWithoutVideosNestedInputSchema: z.ZodType<Prisma.ChannelUpdateOneRequiredWithoutVideosNestedInput> = z.object({
  create: z.union([ z.lazy(() => ChannelCreateWithoutVideosInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutVideosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => ChannelCreateOrConnectWithoutVideosInputSchema).optional(),
  upsert: z.lazy(() => ChannelUpsertWithoutVideosInputSchema).optional(),
  connect: z.lazy(() => ChannelWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => ChannelUpdateToOneWithWhereWithoutVideosInputSchema),z.lazy(() => ChannelUpdateWithoutVideosInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutVideosInputSchema) ]).optional(),
}).strict();

export const CollectionVideoUpdateManyWithoutVideoNestedInputSchema: z.ZodType<Prisma.CollectionVideoUpdateManyWithoutVideoNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutVideoInputSchema),z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutVideoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyVideoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutVideoInputSchema),z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutVideoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutVideoInputSchema),z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutVideoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionVideoScalarWhereInputSchema),z.lazy(() => CollectionVideoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionVideoUncheckedUpdateManyWithoutVideoNestedInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateManyWithoutVideoNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema).array(),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema),z.lazy(() => CollectionVideoCreateOrConnectWithoutVideoInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutVideoInputSchema),z.lazy(() => CollectionVideoUpsertWithWhereUniqueWithoutVideoInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionVideoCreateManyVideoInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionVideoWhereUniqueInputSchema),z.lazy(() => CollectionVideoWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutVideoInputSchema),z.lazy(() => CollectionVideoUpdateWithWhereUniqueWithoutVideoInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutVideoInputSchema),z.lazy(() => CollectionVideoUpdateManyWithWhereWithoutVideoInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionVideoScalarWhereInputSchema),z.lazy(() => CollectionVideoScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionCreateNestedOneWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionCreateNestedOneWithoutCollectionKeywordsInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionKeywordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutCollectionKeywordsInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional()
}).strict();

export const KeywordCreateNestedOneWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordCreateNestedOneWithoutCollectionsInput> = z.object({
  create: z.union([ z.lazy(() => KeywordCreateWithoutCollectionsInputSchema),z.lazy(() => KeywordUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => KeywordCreateOrConnectWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => KeywordWhereUniqueInputSchema).optional()
}).strict();

export const CollectionUpdateOneRequiredWithoutCollectionKeywordsNestedInputSchema: z.ZodType<Prisma.CollectionUpdateOneRequiredWithoutCollectionKeywordsNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionKeywordsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutCollectionKeywordsInputSchema).optional(),
  upsert: z.lazy(() => CollectionUpsertWithoutCollectionKeywordsInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateToOneWithWhereWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUpdateWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutCollectionKeywordsInputSchema) ]).optional(),
}).strict();

export const KeywordUpdateOneRequiredWithoutCollectionsNestedInputSchema: z.ZodType<Prisma.KeywordUpdateOneRequiredWithoutCollectionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => KeywordCreateWithoutCollectionsInputSchema),z.lazy(() => KeywordUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => KeywordCreateOrConnectWithoutCollectionsInputSchema).optional(),
  upsert: z.lazy(() => KeywordUpsertWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => KeywordWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => KeywordUpdateToOneWithWhereWithoutCollectionsInputSchema),z.lazy(() => KeywordUpdateWithoutCollectionsInputSchema),z.lazy(() => KeywordUncheckedUpdateWithoutCollectionsInputSchema) ]).optional(),
}).strict();

export const CollectionCreateNestedOneWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionCreateNestedOneWithoutCollectionVideosInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionVideosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutCollectionVideosInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional()
}).strict();

export const VideoCreateNestedOneWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoCreateNestedOneWithoutCollectionsInput> = z.object({
  create: z.union([ z.lazy(() => VideoCreateWithoutCollectionsInputSchema),z.lazy(() => VideoUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VideoCreateOrConnectWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => VideoWhereUniqueInputSchema).optional()
}).strict();

export const CollectionUpdateOneRequiredWithoutCollectionVideosNestedInputSchema: z.ZodType<Prisma.CollectionUpdateOneRequiredWithoutCollectionVideosNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionVideosInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => CollectionCreateOrConnectWithoutCollectionVideosInputSchema).optional(),
  upsert: z.lazy(() => CollectionUpsertWithoutCollectionVideosInputSchema).optional(),
  connect: z.lazy(() => CollectionWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => CollectionUpdateToOneWithWhereWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUpdateWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutCollectionVideosInputSchema) ]).optional(),
}).strict();

export const VideoUpdateOneRequiredWithoutCollectionsNestedInputSchema: z.ZodType<Prisma.VideoUpdateOneRequiredWithoutCollectionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => VideoCreateWithoutCollectionsInputSchema),z.lazy(() => VideoUncheckedCreateWithoutCollectionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => VideoCreateOrConnectWithoutCollectionsInputSchema).optional(),
  upsert: z.lazy(() => VideoUpsertWithoutCollectionsInputSchema).optional(),
  connect: z.lazy(() => VideoWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => VideoUpdateToOneWithWhereWithoutCollectionsInputSchema),z.lazy(() => VideoUpdateWithoutCollectionsInputSchema),z.lazy(() => VideoUncheckedUpdateWithoutCollectionsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordCreateNestedManyWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordCreateNestedManyWithoutKeywordInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyKeywordInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionKeywordUncheckedCreateNestedManyWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedCreateNestedManyWithoutKeywordInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyKeywordInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CollectionKeywordUpdateManyWithoutKeywordNestedInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateManyWithoutKeywordNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutKeywordInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyKeywordInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutKeywordInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutKeywordInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionKeywordScalarWhereInputSchema),z.lazy(() => CollectionKeywordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CollectionKeywordUncheckedUpdateManyWithoutKeywordNestedInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateManyWithoutKeywordNestedInput> = z.object({
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema).array(),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordCreateOrConnectWithoutKeywordInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUpsertWithWhereUniqueWithoutKeywordInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CollectionKeywordCreateManyKeywordInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CollectionKeywordWhereUniqueInputSchema),z.lazy(() => CollectionKeywordWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUpdateWithWhereUniqueWithoutKeywordInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUpdateManyWithWhereWithoutKeywordInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CollectionKeywordScalarWhereInputSchema),z.lazy(() => CollectionKeywordScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const NestedUuidFilterSchema: z.ZodType<Prisma.NestedUuidFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedUuidWithAggregatesFilterSchema: z.ZodType<Prisma.NestedUuidWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedUuidNullableFilterSchema: z.ZodType<Prisma.NestedUuidNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedUuidNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedUuidNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedUuidNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const CollectionCreateWithoutUserInputSchema: z.ZodType<Prisma.CollectionCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  channel: z.lazy(() => ChannelCreateNestedOneWithoutCollectionsInputSchema),
  collectionKeywords: z.lazy(() => CollectionKeywordCreateNestedManyWithoutCollectionInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  channelId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const CollectionCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.CollectionCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CollectionCreateManyUserInputSchema),z.lazy(() => CollectionCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ChannelCreateWithoutUserInputSchema: z.ZodType<Prisma.ChannelCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  videos: z.lazy(() => VideoCreateNestedManyWithoutChannelInputSchema).optional(),
  collections: z.lazy(() => CollectionCreateNestedManyWithoutChannelInputSchema).optional()
}).strict();

export const ChannelUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.ChannelUncheckedCreateWithoutUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  videos: z.lazy(() => VideoUncheckedCreateNestedManyWithoutChannelInputSchema).optional(),
  collections: z.lazy(() => CollectionUncheckedCreateNestedManyWithoutChannelInputSchema).optional()
}).strict();

export const ChannelCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.ChannelCreateOrConnectWithoutUserInput> = z.object({
  where: z.lazy(() => ChannelWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChannelCreateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ChannelCreateManyUserInputEnvelopeSchema: z.ZodType<Prisma.ChannelCreateManyUserInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => ChannelCreateManyUserInputSchema),z.lazy(() => ChannelCreateManyUserInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CollectionUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CollectionUpdateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionCreateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const CollectionUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CollectionUpdateWithoutUserInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const CollectionUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => CollectionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CollectionUpdateManyMutationInputSchema),z.lazy(() => CollectionUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const CollectionScalarWhereInputSchema: z.ZodType<Prisma.CollectionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionScalarWhereInputSchema),z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionScalarWhereInputSchema),z.lazy(() => CollectionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  slug: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  userId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const ChannelUpsertWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ChannelUpsertWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ChannelWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ChannelUpdateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => ChannelCreateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutUserInputSchema) ]),
}).strict();

export const ChannelUpdateWithWhereUniqueWithoutUserInputSchema: z.ZodType<Prisma.ChannelUpdateWithWhereUniqueWithoutUserInput> = z.object({
  where: z.lazy(() => ChannelWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ChannelUpdateWithoutUserInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutUserInputSchema) ]),
}).strict();

export const ChannelUpdateManyWithWhereWithoutUserInputSchema: z.ZodType<Prisma.ChannelUpdateManyWithWhereWithoutUserInput> = z.object({
  where: z.lazy(() => ChannelScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ChannelUpdateManyMutationInputSchema),z.lazy(() => ChannelUncheckedUpdateManyWithoutUserInputSchema) ]),
}).strict();

export const ChannelScalarWhereInputSchema: z.ZodType<Prisma.ChannelScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => ChannelScalarWhereInputSchema),z.lazy(() => ChannelScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ChannelScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ChannelScalarWhereInputSchema),z.lazy(() => ChannelScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  channelAvatarUrl: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => UuidNullableFilterSchema),z.string() ]).optional().nullable(),
}).strict();

export const UserCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  password: z.string(),
  userName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  channels: z.lazy(() => ChannelCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  password: z.string(),
  userName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  channels: z.lazy(() => ChannelUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutCollectionsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutCollectionsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]),
}).strict();

export const ChannelCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  videos: z.lazy(() => VideoCreateNestedManyWithoutChannelInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutChannelsInputSchema).optional()
}).strict();

export const ChannelUncheckedCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelUncheckedCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string().optional().nullable(),
  videos: z.lazy(() => VideoUncheckedCreateNestedManyWithoutChannelInputSchema).optional()
}).strict();

export const ChannelCreateOrConnectWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelCreateOrConnectWithoutCollectionsInput> = z.object({
  where: z.lazy(() => ChannelWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChannelCreateWithoutCollectionsInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutCollectionsInputSchema) ]),
}).strict();

export const CollectionKeywordCreateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordCreateWithoutCollectionInput> = z.object({
  assignedAt: z.coerce.date().optional(),
  keyword: z.lazy(() => KeywordCreateNestedOneWithoutCollectionsInputSchema)
}).strict();

export const CollectionKeywordUncheckedCreateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedCreateWithoutCollectionInput> = z.object({
  keywordId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionKeywordCreateOrConnectWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordCreateOrConnectWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionKeywordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionKeywordCreateManyCollectionInputEnvelopeSchema: z.ZodType<Prisma.CollectionKeywordCreateManyCollectionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CollectionKeywordCreateManyCollectionInputSchema),z.lazy(() => CollectionKeywordCreateManyCollectionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CollectionVideoCreateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoCreateWithoutCollectionInput> = z.object({
  assignedAt: z.coerce.date().optional(),
  video: z.lazy(() => VideoCreateNestedOneWithoutCollectionsInputSchema)
}).strict();

export const CollectionVideoUncheckedCreateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedCreateWithoutCollectionInput> = z.object({
  videoId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionVideoCreateOrConnectWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoCreateOrConnectWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionVideoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionVideoCreateManyCollectionInputEnvelopeSchema: z.ZodType<Prisma.CollectionVideoCreateManyCollectionInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CollectionVideoCreateManyCollectionInputSchema),z.lazy(() => CollectionVideoCreateManyCollectionInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserUpsertWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUpsertWithoutCollectionsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutCollectionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutCollectionsInputSchema),z.lazy(() => UserUncheckedCreateWithoutCollectionsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutCollectionsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutCollectionsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutCollectionsInputSchema) ]),
}).strict();

export const UserUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  channels: z.lazy(() => ChannelUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  channels: z.lazy(() => ChannelUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ChannelUpsertWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelUpsertWithoutCollectionsInput> = z.object({
  update: z.union([ z.lazy(() => ChannelUpdateWithoutCollectionsInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutCollectionsInputSchema) ]),
  create: z.union([ z.lazy(() => ChannelCreateWithoutCollectionsInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutCollectionsInputSchema) ]),
  where: z.lazy(() => ChannelWhereInputSchema).optional()
}).strict();

export const ChannelUpdateToOneWithWhereWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelUpdateToOneWithWhereWithoutCollectionsInput> = z.object({
  where: z.lazy(() => ChannelWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ChannelUpdateWithoutCollectionsInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutCollectionsInputSchema) ]),
}).strict();

export const ChannelUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  videos: z.lazy(() => VideoUpdateManyWithoutChannelNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutChannelsNestedInputSchema).optional()
}).strict();

export const ChannelUncheckedUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.ChannelUncheckedUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  videos: z.lazy(() => VideoUncheckedUpdateManyWithoutChannelNestedInputSchema).optional()
}).strict();

export const CollectionKeywordUpsertWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUpsertWithWhereUniqueWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionKeywordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CollectionKeywordUpdateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedUpdateWithoutCollectionInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionKeywordUpdateWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateWithWhereUniqueWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionKeywordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CollectionKeywordUpdateWithoutCollectionInputSchema),z.lazy(() => CollectionKeywordUncheckedUpdateWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionKeywordUpdateManyWithWhereWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateManyWithWhereWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionKeywordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CollectionKeywordUpdateManyMutationInputSchema),z.lazy(() => CollectionKeywordUncheckedUpdateManyWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionKeywordScalarWhereInputSchema: z.ZodType<Prisma.CollectionKeywordScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionKeywordScalarWhereInputSchema),z.lazy(() => CollectionKeywordScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionKeywordScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionKeywordScalarWhereInputSchema),z.lazy(() => CollectionKeywordScalarWhereInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  keywordId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CollectionVideoUpsertWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUpsertWithWhereUniqueWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionVideoWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CollectionVideoUpdateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedUpdateWithoutCollectionInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionVideoUpdateWithWhereUniqueWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUpdateWithWhereUniqueWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionVideoWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CollectionVideoUpdateWithoutCollectionInputSchema),z.lazy(() => CollectionVideoUncheckedUpdateWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionVideoUpdateManyWithWhereWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUpdateManyWithWhereWithoutCollectionInput> = z.object({
  where: z.lazy(() => CollectionVideoScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CollectionVideoUpdateManyMutationInputSchema),z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutCollectionInputSchema) ]),
}).strict();

export const CollectionVideoScalarWhereInputSchema: z.ZodType<Prisma.CollectionVideoScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CollectionVideoScalarWhereInputSchema),z.lazy(() => CollectionVideoScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CollectionVideoScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CollectionVideoScalarWhereInputSchema),z.lazy(() => CollectionVideoScalarWhereInputSchema).array() ]).optional(),
  collectionId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  videoId: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  assignedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const VideoCreateWithoutChannelInputSchema: z.ZodType<Prisma.VideoCreateWithoutChannelInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable(),
  collections: z.lazy(() => CollectionVideoCreateNestedManyWithoutVideoInputSchema).optional()
}).strict();

export const VideoUncheckedCreateWithoutChannelInputSchema: z.ZodType<Prisma.VideoUncheckedCreateWithoutChannelInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable(),
  collections: z.lazy(() => CollectionVideoUncheckedCreateNestedManyWithoutVideoInputSchema).optional()
}).strict();

export const VideoCreateOrConnectWithoutChannelInputSchema: z.ZodType<Prisma.VideoCreateOrConnectWithoutChannelInput> = z.object({
  where: z.lazy(() => VideoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VideoCreateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema) ]),
}).strict();

export const VideoCreateManyChannelInputEnvelopeSchema: z.ZodType<Prisma.VideoCreateManyChannelInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => VideoCreateManyChannelInputSchema),z.lazy(() => VideoCreateManyChannelInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CollectionCreateWithoutChannelInputSchema: z.ZodType<Prisma.CollectionCreateWithoutChannelInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputSchema),
  collectionKeywords: z.lazy(() => CollectionKeywordCreateNestedManyWithoutCollectionInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionUncheckedCreateWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateWithoutChannelInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedCreateNestedManyWithoutCollectionInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionCreateOrConnectWithoutChannelInputSchema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutChannelInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionCreateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema) ]),
}).strict();

export const CollectionCreateManyChannelInputEnvelopeSchema: z.ZodType<Prisma.CollectionCreateManyChannelInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CollectionCreateManyChannelInputSchema),z.lazy(() => CollectionCreateManyChannelInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const UserCreateWithoutChannelsInputSchema: z.ZodType<Prisma.UserCreateWithoutChannelsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  password: z.string(),
  userName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collections: z.lazy(() => CollectionCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserUncheckedCreateWithoutChannelsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutChannelsInput> = z.object({
  id: z.string().uuid().optional(),
  email: z.string(),
  password: z.string(),
  userName: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collections: z.lazy(() => CollectionUncheckedCreateNestedManyWithoutUserInputSchema).optional()
}).strict();

export const UserCreateOrConnectWithoutChannelsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutChannelsInput> = z.object({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutChannelsInputSchema),z.lazy(() => UserUncheckedCreateWithoutChannelsInputSchema) ]),
}).strict();

export const VideoUpsertWithWhereUniqueWithoutChannelInputSchema: z.ZodType<Prisma.VideoUpsertWithWhereUniqueWithoutChannelInput> = z.object({
  where: z.lazy(() => VideoWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => VideoUpdateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedUpdateWithoutChannelInputSchema) ]),
  create: z.union([ z.lazy(() => VideoCreateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedCreateWithoutChannelInputSchema) ]),
}).strict();

export const VideoUpdateWithWhereUniqueWithoutChannelInputSchema: z.ZodType<Prisma.VideoUpdateWithWhereUniqueWithoutChannelInput> = z.object({
  where: z.lazy(() => VideoWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => VideoUpdateWithoutChannelInputSchema),z.lazy(() => VideoUncheckedUpdateWithoutChannelInputSchema) ]),
}).strict();

export const VideoUpdateManyWithWhereWithoutChannelInputSchema: z.ZodType<Prisma.VideoUpdateManyWithWhereWithoutChannelInput> = z.object({
  where: z.lazy(() => VideoScalarWhereInputSchema),
  data: z.union([ z.lazy(() => VideoUpdateManyMutationInputSchema),z.lazy(() => VideoUncheckedUpdateManyWithoutChannelInputSchema) ]),
}).strict();

export const VideoScalarWhereInputSchema: z.ZodType<Prisma.VideoScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => VideoScalarWhereInputSchema),z.lazy(() => VideoScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => VideoScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => VideoScalarWhereInputSchema),z.lazy(() => VideoScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => UuidFilterSchema),z.string() ]).optional(),
  title: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  url: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  description: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  thumbnailUrl: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  publishedAt: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  channelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const CollectionUpsertWithWhereUniqueWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUpsertWithWhereUniqueWithoutChannelInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CollectionUpdateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutChannelInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionCreateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutChannelInputSchema) ]),
}).strict();

export const CollectionUpdateWithWhereUniqueWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUpdateWithWhereUniqueWithoutChannelInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CollectionUpdateWithoutChannelInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutChannelInputSchema) ]),
}).strict();

export const CollectionUpdateManyWithWhereWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUpdateManyWithWhereWithoutChannelInput> = z.object({
  where: z.lazy(() => CollectionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CollectionUpdateManyMutationInputSchema),z.lazy(() => CollectionUncheckedUpdateManyWithoutChannelInputSchema) ]),
}).strict();

export const UserUpsertWithoutChannelsInputSchema: z.ZodType<Prisma.UserUpsertWithoutChannelsInput> = z.object({
  update: z.union([ z.lazy(() => UserUpdateWithoutChannelsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutChannelsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutChannelsInputSchema),z.lazy(() => UserUncheckedCreateWithoutChannelsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional()
}).strict();

export const UserUpdateToOneWithWhereWithoutChannelsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutChannelsInput> = z.object({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutChannelsInputSchema),z.lazy(() => UserUncheckedUpdateWithoutChannelsInputSchema) ]),
}).strict();

export const UserUpdateWithoutChannelsInputSchema: z.ZodType<Prisma.UserUpdateWithoutChannelsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const UserUncheckedUpdateWithoutChannelsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutChannelsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  userName: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionUncheckedUpdateManyWithoutUserNestedInputSchema).optional()
}).strict();

export const ChannelCreateWithoutVideosInputSchema: z.ZodType<Prisma.ChannelCreateWithoutVideosInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collections: z.lazy(() => CollectionCreateNestedManyWithoutChannelInputSchema).optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutChannelsInputSchema).optional()
}).strict();

export const ChannelUncheckedCreateWithoutVideosInputSchema: z.ZodType<Prisma.ChannelUncheckedCreateWithoutVideosInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  userId: z.string().optional().nullable(),
  collections: z.lazy(() => CollectionUncheckedCreateNestedManyWithoutChannelInputSchema).optional()
}).strict();

export const ChannelCreateOrConnectWithoutVideosInputSchema: z.ZodType<Prisma.ChannelCreateOrConnectWithoutVideosInput> = z.object({
  where: z.lazy(() => ChannelWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ChannelCreateWithoutVideosInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutVideosInputSchema) ]),
}).strict();

export const CollectionVideoCreateWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoCreateWithoutVideoInput> = z.object({
  assignedAt: z.coerce.date().optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutCollectionVideosInputSchema)
}).strict();

export const CollectionVideoUncheckedCreateWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedCreateWithoutVideoInput> = z.object({
  collectionId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionVideoCreateOrConnectWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoCreateOrConnectWithoutVideoInput> = z.object({
  where: z.lazy(() => CollectionVideoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema) ]),
}).strict();

export const CollectionVideoCreateManyVideoInputEnvelopeSchema: z.ZodType<Prisma.CollectionVideoCreateManyVideoInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CollectionVideoCreateManyVideoInputSchema),z.lazy(() => CollectionVideoCreateManyVideoInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const ChannelUpsertWithoutVideosInputSchema: z.ZodType<Prisma.ChannelUpsertWithoutVideosInput> = z.object({
  update: z.union([ z.lazy(() => ChannelUpdateWithoutVideosInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutVideosInputSchema) ]),
  create: z.union([ z.lazy(() => ChannelCreateWithoutVideosInputSchema),z.lazy(() => ChannelUncheckedCreateWithoutVideosInputSchema) ]),
  where: z.lazy(() => ChannelWhereInputSchema).optional()
}).strict();

export const ChannelUpdateToOneWithWhereWithoutVideosInputSchema: z.ZodType<Prisma.ChannelUpdateToOneWithWhereWithoutVideosInput> = z.object({
  where: z.lazy(() => ChannelWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => ChannelUpdateWithoutVideosInputSchema),z.lazy(() => ChannelUncheckedUpdateWithoutVideosInputSchema) ]),
}).strict();

export const ChannelUpdateWithoutVideosInputSchema: z.ZodType<Prisma.ChannelUpdateWithoutVideosInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collections: z.lazy(() => CollectionUpdateManyWithoutChannelNestedInputSchema).optional(),
  user: z.lazy(() => UserUpdateOneWithoutChannelsNestedInputSchema).optional()
}).strict();

export const ChannelUncheckedUpdateWithoutVideosInputSchema: z.ZodType<Prisma.ChannelUncheckedUpdateWithoutVideosInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collections: z.lazy(() => CollectionUncheckedUpdateManyWithoutChannelNestedInputSchema).optional()
}).strict();

export const CollectionVideoUpsertWithWhereUniqueWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUpsertWithWhereUniqueWithoutVideoInput> = z.object({
  where: z.lazy(() => CollectionVideoWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CollectionVideoUpdateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedUpdateWithoutVideoInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionVideoCreateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedCreateWithoutVideoInputSchema) ]),
}).strict();

export const CollectionVideoUpdateWithWhereUniqueWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUpdateWithWhereUniqueWithoutVideoInput> = z.object({
  where: z.lazy(() => CollectionVideoWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CollectionVideoUpdateWithoutVideoInputSchema),z.lazy(() => CollectionVideoUncheckedUpdateWithoutVideoInputSchema) ]),
}).strict();

export const CollectionVideoUpdateManyWithWhereWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUpdateManyWithWhereWithoutVideoInput> = z.object({
  where: z.lazy(() => CollectionVideoScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CollectionVideoUpdateManyMutationInputSchema),z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutVideoInputSchema) ]),
}).strict();

export const CollectionCreateWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionCreateWithoutCollectionKeywordsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputSchema),
  channel: z.lazy(() => ChannelCreateNestedOneWithoutCollectionsInputSchema),
  collectionVideos: z.lazy(() => CollectionVideoCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionUncheckedCreateWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateWithoutCollectionKeywordsInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  userId: z.string(),
  channelId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionCreateOrConnectWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutCollectionKeywordsInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionKeywordsInputSchema) ]),
}).strict();

export const KeywordCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const KeywordUncheckedCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordUncheckedCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  text: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const KeywordCreateOrConnectWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordCreateOrConnectWithoutCollectionsInput> = z.object({
  where: z.lazy(() => KeywordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => KeywordCreateWithoutCollectionsInputSchema),z.lazy(() => KeywordUncheckedCreateWithoutCollectionsInputSchema) ]),
}).strict();

export const CollectionUpsertWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionUpsertWithoutCollectionKeywordsInput> = z.object({
  update: z.union([ z.lazy(() => CollectionUpdateWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutCollectionKeywordsInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionKeywordsInputSchema) ]),
  where: z.lazy(() => CollectionWhereInputSchema).optional()
}).strict();

export const CollectionUpdateToOneWithWhereWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionUpdateToOneWithWhereWithoutCollectionKeywordsInput> = z.object({
  where: z.lazy(() => CollectionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CollectionUpdateWithoutCollectionKeywordsInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutCollectionKeywordsInputSchema) ]),
}).strict();

export const CollectionUpdateWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionUpdateWithoutCollectionKeywordsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  channel: z.lazy(() => ChannelUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionUncheckedUpdateWithoutCollectionKeywordsInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateWithoutCollectionKeywordsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const KeywordUpsertWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordUpsertWithoutCollectionsInput> = z.object({
  update: z.union([ z.lazy(() => KeywordUpdateWithoutCollectionsInputSchema),z.lazy(() => KeywordUncheckedUpdateWithoutCollectionsInputSchema) ]),
  create: z.union([ z.lazy(() => KeywordCreateWithoutCollectionsInputSchema),z.lazy(() => KeywordUncheckedCreateWithoutCollectionsInputSchema) ]),
  where: z.lazy(() => KeywordWhereInputSchema).optional()
}).strict();

export const KeywordUpdateToOneWithWhereWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordUpdateToOneWithWhereWithoutCollectionsInput> = z.object({
  where: z.lazy(() => KeywordWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => KeywordUpdateWithoutCollectionsInputSchema),z.lazy(() => KeywordUncheckedUpdateWithoutCollectionsInputSchema) ]),
}).strict();

export const KeywordUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const KeywordUncheckedUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.KeywordUncheckedUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  text: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionCreateWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionCreateWithoutCollectionVideosInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  user: z.lazy(() => UserCreateNestedOneWithoutCollectionsInputSchema),
  channel: z.lazy(() => ChannelCreateNestedOneWithoutCollectionsInputSchema),
  collectionKeywords: z.lazy(() => CollectionKeywordCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionUncheckedCreateWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionUncheckedCreateWithoutCollectionVideosInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  userId: z.string(),
  channelId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedCreateNestedManyWithoutCollectionInputSchema).optional()
}).strict();

export const CollectionCreateOrConnectWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionCreateOrConnectWithoutCollectionVideosInput> = z.object({
  where: z.lazy(() => CollectionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionVideosInputSchema) ]),
}).strict();

export const VideoCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable(),
  channel: z.lazy(() => ChannelCreateNestedOneWithoutVideosInputSchema)
}).strict();

export const VideoUncheckedCreateWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoUncheckedCreateWithoutCollectionsInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable(),
  channelId: z.string()
}).strict();

export const VideoCreateOrConnectWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoCreateOrConnectWithoutCollectionsInput> = z.object({
  where: z.lazy(() => VideoWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => VideoCreateWithoutCollectionsInputSchema),z.lazy(() => VideoUncheckedCreateWithoutCollectionsInputSchema) ]),
}).strict();

export const CollectionUpsertWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionUpsertWithoutCollectionVideosInput> = z.object({
  update: z.union([ z.lazy(() => CollectionUpdateWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutCollectionVideosInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionCreateWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUncheckedCreateWithoutCollectionVideosInputSchema) ]),
  where: z.lazy(() => CollectionWhereInputSchema).optional()
}).strict();

export const CollectionUpdateToOneWithWhereWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionUpdateToOneWithWhereWithoutCollectionVideosInput> = z.object({
  where: z.lazy(() => CollectionWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => CollectionUpdateWithoutCollectionVideosInputSchema),z.lazy(() => CollectionUncheckedUpdateWithoutCollectionVideosInputSchema) ]),
}).strict();

export const CollectionUpdateWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionUpdateWithoutCollectionVideosInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  channel: z.lazy(() => ChannelUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionUncheckedUpdateWithoutCollectionVideosInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateWithoutCollectionVideosInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const VideoUpsertWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoUpsertWithoutCollectionsInput> = z.object({
  update: z.union([ z.lazy(() => VideoUpdateWithoutCollectionsInputSchema),z.lazy(() => VideoUncheckedUpdateWithoutCollectionsInputSchema) ]),
  create: z.union([ z.lazy(() => VideoCreateWithoutCollectionsInputSchema),z.lazy(() => VideoUncheckedCreateWithoutCollectionsInputSchema) ]),
  where: z.lazy(() => VideoWhereInputSchema).optional()
}).strict();

export const VideoUpdateToOneWithWhereWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoUpdateToOneWithWhereWithoutCollectionsInput> = z.object({
  where: z.lazy(() => VideoWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => VideoUpdateWithoutCollectionsInputSchema),z.lazy(() => VideoUncheckedUpdateWithoutCollectionsInputSchema) ]),
}).strict();

export const VideoUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  channel: z.lazy(() => ChannelUpdateOneRequiredWithoutVideosNestedInputSchema).optional()
}).strict();

export const VideoUncheckedUpdateWithoutCollectionsInputSchema: z.ZodType<Prisma.VideoUncheckedUpdateWithoutCollectionsInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordCreateWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordCreateWithoutKeywordInput> = z.object({
  assignedAt: z.coerce.date().optional(),
  collection: z.lazy(() => CollectionCreateNestedOneWithoutCollectionKeywordsInputSchema)
}).strict();

export const CollectionKeywordUncheckedCreateWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedCreateWithoutKeywordInput> = z.object({
  collectionId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionKeywordCreateOrConnectWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordCreateOrConnectWithoutKeywordInput> = z.object({
  where: z.lazy(() => CollectionKeywordWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema) ]),
}).strict();

export const CollectionKeywordCreateManyKeywordInputEnvelopeSchema: z.ZodType<Prisma.CollectionKeywordCreateManyKeywordInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CollectionKeywordCreateManyKeywordInputSchema),z.lazy(() => CollectionKeywordCreateManyKeywordInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CollectionKeywordUpsertWithWhereUniqueWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUpsertWithWhereUniqueWithoutKeywordInput> = z.object({
  where: z.lazy(() => CollectionKeywordWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CollectionKeywordUpdateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedUpdateWithoutKeywordInputSchema) ]),
  create: z.union([ z.lazy(() => CollectionKeywordCreateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedCreateWithoutKeywordInputSchema) ]),
}).strict();

export const CollectionKeywordUpdateWithWhereUniqueWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateWithWhereUniqueWithoutKeywordInput> = z.object({
  where: z.lazy(() => CollectionKeywordWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CollectionKeywordUpdateWithoutKeywordInputSchema),z.lazy(() => CollectionKeywordUncheckedUpdateWithoutKeywordInputSchema) ]),
}).strict();

export const CollectionKeywordUpdateManyWithWhereWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateManyWithWhereWithoutKeywordInput> = z.object({
  where: z.lazy(() => CollectionKeywordScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CollectionKeywordUpdateManyMutationInputSchema),z.lazy(() => CollectionKeywordUncheckedUpdateManyWithoutKeywordInputSchema) ]),
}).strict();

export const CollectionCreateManyUserInputSchema: z.ZodType<Prisma.CollectionCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  channelId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const ChannelCreateManyUserInputSchema: z.ZodType<Prisma.ChannelCreateManyUserInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  channelId: z.string(),
  channelAvatarUrl: z.string().optional().nullable(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CollectionUpdateWithoutUserInputSchema: z.ZodType<Prisma.CollectionUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  channel: z.lazy(() => ChannelUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUpdateManyWithoutCollectionNestedInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const ChannelUpdateWithoutUserInputSchema: z.ZodType<Prisma.ChannelUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  videos: z.lazy(() => VideoUpdateManyWithoutChannelNestedInputSchema).optional(),
  collections: z.lazy(() => CollectionUpdateManyWithoutChannelNestedInputSchema).optional()
}).strict();

export const ChannelUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.ChannelUncheckedUpdateWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  videos: z.lazy(() => VideoUncheckedUpdateManyWithoutChannelNestedInputSchema).optional(),
  collections: z.lazy(() => CollectionUncheckedUpdateManyWithoutChannelNestedInputSchema).optional()
}).strict();

export const ChannelUncheckedUpdateManyWithoutUserInputSchema: z.ZodType<Prisma.ChannelUncheckedUpdateManyWithoutUserInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  channelAvatarUrl: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordCreateManyCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordCreateManyCollectionInput> = z.object({
  keywordId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionVideoCreateManyCollectionInputSchema: z.ZodType<Prisma.CollectionVideoCreateManyCollectionInput> = z.object({
  videoId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionKeywordUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateWithoutCollectionInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  keyword: z.lazy(() => KeywordUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional()
}).strict();

export const CollectionKeywordUncheckedUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateWithoutCollectionInput> = z.object({
  keywordId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordUncheckedUpdateManyWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateManyWithoutCollectionInput> = z.object({
  keywordId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionVideoUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUpdateWithoutCollectionInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  video: z.lazy(() => VideoUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional()
}).strict();

export const CollectionVideoUncheckedUpdateWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateWithoutCollectionInput> = z.object({
  videoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionVideoUncheckedUpdateManyWithoutCollectionInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateManyWithoutCollectionInput> = z.object({
  videoId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const VideoCreateManyChannelInputSchema: z.ZodType<Prisma.VideoCreateManyChannelInput> = z.object({
  id: z.string().uuid().optional(),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  thumbnailUrl: z.string(),
  publishedAt: z.coerce.date().optional().nullable()
}).strict();

export const CollectionCreateManyChannelInputSchema: z.ZodType<Prisma.CollectionCreateManyChannelInput> = z.object({
  id: z.string().uuid().optional(),
  name: z.string(),
  slug: z.string().optional().nullable(),
  userId: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const VideoUpdateWithoutChannelInputSchema: z.ZodType<Prisma.VideoUpdateWithoutChannelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collections: z.lazy(() => CollectionVideoUpdateManyWithoutVideoNestedInputSchema).optional()
}).strict();

export const VideoUncheckedUpdateWithoutChannelInputSchema: z.ZodType<Prisma.VideoUncheckedUpdateWithoutChannelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  collections: z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutVideoNestedInputSchema).optional()
}).strict();

export const VideoUncheckedUpdateManyWithoutChannelInputSchema: z.ZodType<Prisma.VideoUncheckedUpdateManyWithoutChannelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  title: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  url: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  description: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  thumbnailUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  publishedAt: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const CollectionUpdateWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUpdateWithoutChannelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutCollectionsNestedInputSchema).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUpdateManyWithoutCollectionNestedInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionUncheckedUpdateWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateWithoutChannelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collectionKeywords: z.lazy(() => CollectionKeywordUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional(),
  collectionVideos: z.lazy(() => CollectionVideoUncheckedUpdateManyWithoutCollectionNestedInputSchema).optional()
}).strict();

export const CollectionUncheckedUpdateManyWithoutChannelInputSchema: z.ZodType<Prisma.CollectionUncheckedUpdateManyWithoutChannelInput> = z.object({
  id: z.union([ z.string().uuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  slug: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionVideoCreateManyVideoInputSchema: z.ZodType<Prisma.CollectionVideoCreateManyVideoInput> = z.object({
  collectionId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionVideoUpdateWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUpdateWithoutVideoInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutCollectionVideosNestedInputSchema).optional()
}).strict();

export const CollectionVideoUncheckedUpdateWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateWithoutVideoInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionVideoUncheckedUpdateManyWithoutVideoInputSchema: z.ZodType<Prisma.CollectionVideoUncheckedUpdateManyWithoutVideoInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordCreateManyKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordCreateManyKeywordInput> = z.object({
  collectionId: z.string(),
  assignedAt: z.coerce.date().optional()
}).strict();

export const CollectionKeywordUpdateWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUpdateWithoutKeywordInput> = z.object({
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  collection: z.lazy(() => CollectionUpdateOneRequiredWithoutCollectionKeywordsNestedInputSchema).optional()
}).strict();

export const CollectionKeywordUncheckedUpdateWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateWithoutKeywordInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CollectionKeywordUncheckedUpdateManyWithoutKeywordInputSchema: z.ZodType<Prisma.CollectionKeywordUncheckedUpdateManyWithoutKeywordInput> = z.object({
  collectionId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  assignedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema,UserScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(),UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(),UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(),
  having: UserScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const CollectionFindFirstArgsSchema: z.ZodType<Prisma.CollectionFindFirstArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereInputSchema.optional(),
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(),CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionScalarFieldEnumSchema,CollectionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CollectionFindFirstOrThrowArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereInputSchema.optional(),
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(),CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionScalarFieldEnumSchema,CollectionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionFindManyArgsSchema: z.ZodType<Prisma.CollectionFindManyArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereInputSchema.optional(),
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(),CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionScalarFieldEnumSchema,CollectionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionAggregateArgsSchema: z.ZodType<Prisma.CollectionAggregateArgs> = z.object({
  where: CollectionWhereInputSchema.optional(),
  orderBy: z.union([ CollectionOrderByWithRelationInputSchema.array(),CollectionOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CollectionGroupByArgsSchema: z.ZodType<Prisma.CollectionGroupByArgs> = z.object({
  where: CollectionWhereInputSchema.optional(),
  orderBy: z.union([ CollectionOrderByWithAggregationInputSchema.array(),CollectionOrderByWithAggregationInputSchema ]).optional(),
  by: CollectionScalarFieldEnumSchema.array(),
  having: CollectionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CollectionFindUniqueArgsSchema: z.ZodType<Prisma.CollectionFindUniqueArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema,
}).strict() ;

export const CollectionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CollectionFindUniqueOrThrowArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema,
}).strict() ;

export const ChannelFindFirstArgsSchema: z.ZodType<Prisma.ChannelFindFirstArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  where: ChannelWhereInputSchema.optional(),
  orderBy: z.union([ ChannelOrderByWithRelationInputSchema.array(),ChannelOrderByWithRelationInputSchema ]).optional(),
  cursor: ChannelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChannelScalarFieldEnumSchema,ChannelScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ChannelFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ChannelFindFirstOrThrowArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  where: ChannelWhereInputSchema.optional(),
  orderBy: z.union([ ChannelOrderByWithRelationInputSchema.array(),ChannelOrderByWithRelationInputSchema ]).optional(),
  cursor: ChannelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChannelScalarFieldEnumSchema,ChannelScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ChannelFindManyArgsSchema: z.ZodType<Prisma.ChannelFindManyArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  where: ChannelWhereInputSchema.optional(),
  orderBy: z.union([ ChannelOrderByWithRelationInputSchema.array(),ChannelOrderByWithRelationInputSchema ]).optional(),
  cursor: ChannelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ChannelScalarFieldEnumSchema,ChannelScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const ChannelAggregateArgsSchema: z.ZodType<Prisma.ChannelAggregateArgs> = z.object({
  where: ChannelWhereInputSchema.optional(),
  orderBy: z.union([ ChannelOrderByWithRelationInputSchema.array(),ChannelOrderByWithRelationInputSchema ]).optional(),
  cursor: ChannelWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ChannelGroupByArgsSchema: z.ZodType<Prisma.ChannelGroupByArgs> = z.object({
  where: ChannelWhereInputSchema.optional(),
  orderBy: z.union([ ChannelOrderByWithAggregationInputSchema.array(),ChannelOrderByWithAggregationInputSchema ]).optional(),
  by: ChannelScalarFieldEnumSchema.array(),
  having: ChannelScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const ChannelFindUniqueArgsSchema: z.ZodType<Prisma.ChannelFindUniqueArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  where: ChannelWhereUniqueInputSchema,
}).strict() ;

export const ChannelFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ChannelFindUniqueOrThrowArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  where: ChannelWhereUniqueInputSchema,
}).strict() ;

export const VideoFindFirstArgsSchema: z.ZodType<Prisma.VideoFindFirstArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  where: VideoWhereInputSchema.optional(),
  orderBy: z.union([ VideoOrderByWithRelationInputSchema.array(),VideoOrderByWithRelationInputSchema ]).optional(),
  cursor: VideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VideoScalarFieldEnumSchema,VideoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VideoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.VideoFindFirstOrThrowArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  where: VideoWhereInputSchema.optional(),
  orderBy: z.union([ VideoOrderByWithRelationInputSchema.array(),VideoOrderByWithRelationInputSchema ]).optional(),
  cursor: VideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VideoScalarFieldEnumSchema,VideoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VideoFindManyArgsSchema: z.ZodType<Prisma.VideoFindManyArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  where: VideoWhereInputSchema.optional(),
  orderBy: z.union([ VideoOrderByWithRelationInputSchema.array(),VideoOrderByWithRelationInputSchema ]).optional(),
  cursor: VideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ VideoScalarFieldEnumSchema,VideoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const VideoAggregateArgsSchema: z.ZodType<Prisma.VideoAggregateArgs> = z.object({
  where: VideoWhereInputSchema.optional(),
  orderBy: z.union([ VideoOrderByWithRelationInputSchema.array(),VideoOrderByWithRelationInputSchema ]).optional(),
  cursor: VideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VideoGroupByArgsSchema: z.ZodType<Prisma.VideoGroupByArgs> = z.object({
  where: VideoWhereInputSchema.optional(),
  orderBy: z.union([ VideoOrderByWithAggregationInputSchema.array(),VideoOrderByWithAggregationInputSchema ]).optional(),
  by: VideoScalarFieldEnumSchema.array(),
  having: VideoScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const VideoFindUniqueArgsSchema: z.ZodType<Prisma.VideoFindUniqueArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  where: VideoWhereUniqueInputSchema,
}).strict() ;

export const VideoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.VideoFindUniqueOrThrowArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  where: VideoWhereUniqueInputSchema,
}).strict() ;

export const CollectionKeywordFindFirstArgsSchema: z.ZodType<Prisma.CollectionKeywordFindFirstArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  where: CollectionKeywordWhereInputSchema.optional(),
  orderBy: z.union([ CollectionKeywordOrderByWithRelationInputSchema.array(),CollectionKeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionKeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionKeywordScalarFieldEnumSchema,CollectionKeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionKeywordFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CollectionKeywordFindFirstOrThrowArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  where: CollectionKeywordWhereInputSchema.optional(),
  orderBy: z.union([ CollectionKeywordOrderByWithRelationInputSchema.array(),CollectionKeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionKeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionKeywordScalarFieldEnumSchema,CollectionKeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionKeywordFindManyArgsSchema: z.ZodType<Prisma.CollectionKeywordFindManyArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  where: CollectionKeywordWhereInputSchema.optional(),
  orderBy: z.union([ CollectionKeywordOrderByWithRelationInputSchema.array(),CollectionKeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionKeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionKeywordScalarFieldEnumSchema,CollectionKeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionKeywordAggregateArgsSchema: z.ZodType<Prisma.CollectionKeywordAggregateArgs> = z.object({
  where: CollectionKeywordWhereInputSchema.optional(),
  orderBy: z.union([ CollectionKeywordOrderByWithRelationInputSchema.array(),CollectionKeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionKeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CollectionKeywordGroupByArgsSchema: z.ZodType<Prisma.CollectionKeywordGroupByArgs> = z.object({
  where: CollectionKeywordWhereInputSchema.optional(),
  orderBy: z.union([ CollectionKeywordOrderByWithAggregationInputSchema.array(),CollectionKeywordOrderByWithAggregationInputSchema ]).optional(),
  by: CollectionKeywordScalarFieldEnumSchema.array(),
  having: CollectionKeywordScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CollectionKeywordFindUniqueArgsSchema: z.ZodType<Prisma.CollectionKeywordFindUniqueArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  where: CollectionKeywordWhereUniqueInputSchema,
}).strict() ;

export const CollectionKeywordFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CollectionKeywordFindUniqueOrThrowArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  where: CollectionKeywordWhereUniqueInputSchema,
}).strict() ;

export const CollectionVideoFindFirstArgsSchema: z.ZodType<Prisma.CollectionVideoFindFirstArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  where: CollectionVideoWhereInputSchema.optional(),
  orderBy: z.union([ CollectionVideoOrderByWithRelationInputSchema.array(),CollectionVideoOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionVideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionVideoScalarFieldEnumSchema,CollectionVideoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionVideoFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CollectionVideoFindFirstOrThrowArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  where: CollectionVideoWhereInputSchema.optional(),
  orderBy: z.union([ CollectionVideoOrderByWithRelationInputSchema.array(),CollectionVideoOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionVideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionVideoScalarFieldEnumSchema,CollectionVideoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionVideoFindManyArgsSchema: z.ZodType<Prisma.CollectionVideoFindManyArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  where: CollectionVideoWhereInputSchema.optional(),
  orderBy: z.union([ CollectionVideoOrderByWithRelationInputSchema.array(),CollectionVideoOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionVideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CollectionVideoScalarFieldEnumSchema,CollectionVideoScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CollectionVideoAggregateArgsSchema: z.ZodType<Prisma.CollectionVideoAggregateArgs> = z.object({
  where: CollectionVideoWhereInputSchema.optional(),
  orderBy: z.union([ CollectionVideoOrderByWithRelationInputSchema.array(),CollectionVideoOrderByWithRelationInputSchema ]).optional(),
  cursor: CollectionVideoWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CollectionVideoGroupByArgsSchema: z.ZodType<Prisma.CollectionVideoGroupByArgs> = z.object({
  where: CollectionVideoWhereInputSchema.optional(),
  orderBy: z.union([ CollectionVideoOrderByWithAggregationInputSchema.array(),CollectionVideoOrderByWithAggregationInputSchema ]).optional(),
  by: CollectionVideoScalarFieldEnumSchema.array(),
  having: CollectionVideoScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CollectionVideoFindUniqueArgsSchema: z.ZodType<Prisma.CollectionVideoFindUniqueArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  where: CollectionVideoWhereUniqueInputSchema,
}).strict() ;

export const CollectionVideoFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CollectionVideoFindUniqueOrThrowArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  where: CollectionVideoWhereUniqueInputSchema,
}).strict() ;

export const KeywordFindFirstArgsSchema: z.ZodType<Prisma.KeywordFindFirstArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereInputSchema.optional(),
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(),KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KeywordScalarFieldEnumSchema,KeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KeywordFindFirstOrThrowArgsSchema: z.ZodType<Prisma.KeywordFindFirstOrThrowArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereInputSchema.optional(),
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(),KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KeywordScalarFieldEnumSchema,KeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KeywordFindManyArgsSchema: z.ZodType<Prisma.KeywordFindManyArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereInputSchema.optional(),
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(),KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ KeywordScalarFieldEnumSchema,KeywordScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const KeywordAggregateArgsSchema: z.ZodType<Prisma.KeywordAggregateArgs> = z.object({
  where: KeywordWhereInputSchema.optional(),
  orderBy: z.union([ KeywordOrderByWithRelationInputSchema.array(),KeywordOrderByWithRelationInputSchema ]).optional(),
  cursor: KeywordWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const KeywordGroupByArgsSchema: z.ZodType<Prisma.KeywordGroupByArgs> = z.object({
  where: KeywordWhereInputSchema.optional(),
  orderBy: z.union([ KeywordOrderByWithAggregationInputSchema.array(),KeywordOrderByWithAggregationInputSchema ]).optional(),
  by: KeywordScalarFieldEnumSchema.array(),
  having: KeywordScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const KeywordFindUniqueArgsSchema: z.ZodType<Prisma.KeywordFindUniqueArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema,
}).strict() ;

export const KeywordFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.KeywordFindUniqueOrThrowArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema,
}).strict() ;

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
}).strict() ;

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
  create: z.union([ UserCreateInputSchema,UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
}).strict() ;

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserCreateManyAndReturnArgsSchema: z.ZodType<Prisma.UserCreateManyAndReturnArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema,UserCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema,UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema,
}).strict() ;

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.UserUpdateManyAndReturnArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema,UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionCreateArgsSchema: z.ZodType<Prisma.CollectionCreateArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  data: z.union([ CollectionCreateInputSchema,CollectionUncheckedCreateInputSchema ]),
}).strict() ;

export const CollectionUpsertArgsSchema: z.ZodType<Prisma.CollectionUpsertArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema,
  create: z.union([ CollectionCreateInputSchema,CollectionUncheckedCreateInputSchema ]),
  update: z.union([ CollectionUpdateInputSchema,CollectionUncheckedUpdateInputSchema ]),
}).strict() ;

export const CollectionCreateManyArgsSchema: z.ZodType<Prisma.CollectionCreateManyArgs> = z.object({
  data: z.union([ CollectionCreateManyInputSchema,CollectionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CollectionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionCreateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionCreateManyInputSchema,CollectionCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CollectionDeleteArgsSchema: z.ZodType<Prisma.CollectionDeleteArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  where: CollectionWhereUniqueInputSchema,
}).strict() ;

export const CollectionUpdateArgsSchema: z.ZodType<Prisma.CollectionUpdateArgs> = z.object({
  select: CollectionSelectSchema.optional(),
  include: CollectionIncludeSchema.optional(),
  data: z.union([ CollectionUpdateInputSchema,CollectionUncheckedUpdateInputSchema ]),
  where: CollectionWhereUniqueInputSchema,
}).strict() ;

export const CollectionUpdateManyArgsSchema: z.ZodType<Prisma.CollectionUpdateManyArgs> = z.object({
  data: z.union([ CollectionUpdateManyMutationInputSchema,CollectionUncheckedUpdateManyInputSchema ]),
  where: CollectionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionUpdateManyMutationInputSchema,CollectionUncheckedUpdateManyInputSchema ]),
  where: CollectionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionDeleteManyArgsSchema: z.ZodType<Prisma.CollectionDeleteManyArgs> = z.object({
  where: CollectionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ChannelCreateArgsSchema: z.ZodType<Prisma.ChannelCreateArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  data: z.union([ ChannelCreateInputSchema,ChannelUncheckedCreateInputSchema ]),
}).strict() ;

export const ChannelUpsertArgsSchema: z.ZodType<Prisma.ChannelUpsertArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  where: ChannelWhereUniqueInputSchema,
  create: z.union([ ChannelCreateInputSchema,ChannelUncheckedCreateInputSchema ]),
  update: z.union([ ChannelUpdateInputSchema,ChannelUncheckedUpdateInputSchema ]),
}).strict() ;

export const ChannelCreateManyArgsSchema: z.ZodType<Prisma.ChannelCreateManyArgs> = z.object({
  data: z.union([ ChannelCreateManyInputSchema,ChannelCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ChannelCreateManyAndReturnArgsSchema: z.ZodType<Prisma.ChannelCreateManyAndReturnArgs> = z.object({
  data: z.union([ ChannelCreateManyInputSchema,ChannelCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const ChannelDeleteArgsSchema: z.ZodType<Prisma.ChannelDeleteArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  where: ChannelWhereUniqueInputSchema,
}).strict() ;

export const ChannelUpdateArgsSchema: z.ZodType<Prisma.ChannelUpdateArgs> = z.object({
  select: ChannelSelectSchema.optional(),
  include: ChannelIncludeSchema.optional(),
  data: z.union([ ChannelUpdateInputSchema,ChannelUncheckedUpdateInputSchema ]),
  where: ChannelWhereUniqueInputSchema,
}).strict() ;

export const ChannelUpdateManyArgsSchema: z.ZodType<Prisma.ChannelUpdateManyArgs> = z.object({
  data: z.union([ ChannelUpdateManyMutationInputSchema,ChannelUncheckedUpdateManyInputSchema ]),
  where: ChannelWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ChannelUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.ChannelUpdateManyAndReturnArgs> = z.object({
  data: z.union([ ChannelUpdateManyMutationInputSchema,ChannelUncheckedUpdateManyInputSchema ]),
  where: ChannelWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const ChannelDeleteManyArgsSchema: z.ZodType<Prisma.ChannelDeleteManyArgs> = z.object({
  where: ChannelWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VideoCreateArgsSchema: z.ZodType<Prisma.VideoCreateArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  data: z.union([ VideoCreateInputSchema,VideoUncheckedCreateInputSchema ]),
}).strict() ;

export const VideoUpsertArgsSchema: z.ZodType<Prisma.VideoUpsertArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  where: VideoWhereUniqueInputSchema,
  create: z.union([ VideoCreateInputSchema,VideoUncheckedCreateInputSchema ]),
  update: z.union([ VideoUpdateInputSchema,VideoUncheckedUpdateInputSchema ]),
}).strict() ;

export const VideoCreateManyArgsSchema: z.ZodType<Prisma.VideoCreateManyArgs> = z.object({
  data: z.union([ VideoCreateManyInputSchema,VideoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VideoCreateManyAndReturnArgsSchema: z.ZodType<Prisma.VideoCreateManyAndReturnArgs> = z.object({
  data: z.union([ VideoCreateManyInputSchema,VideoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const VideoDeleteArgsSchema: z.ZodType<Prisma.VideoDeleteArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  where: VideoWhereUniqueInputSchema,
}).strict() ;

export const VideoUpdateArgsSchema: z.ZodType<Prisma.VideoUpdateArgs> = z.object({
  select: VideoSelectSchema.optional(),
  include: VideoIncludeSchema.optional(),
  data: z.union([ VideoUpdateInputSchema,VideoUncheckedUpdateInputSchema ]),
  where: VideoWhereUniqueInputSchema,
}).strict() ;

export const VideoUpdateManyArgsSchema: z.ZodType<Prisma.VideoUpdateManyArgs> = z.object({
  data: z.union([ VideoUpdateManyMutationInputSchema,VideoUncheckedUpdateManyInputSchema ]),
  where: VideoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VideoUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.VideoUpdateManyAndReturnArgs> = z.object({
  data: z.union([ VideoUpdateManyMutationInputSchema,VideoUncheckedUpdateManyInputSchema ]),
  where: VideoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const VideoDeleteManyArgsSchema: z.ZodType<Prisma.VideoDeleteManyArgs> = z.object({
  where: VideoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionKeywordCreateArgsSchema: z.ZodType<Prisma.CollectionKeywordCreateArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  data: z.union([ CollectionKeywordCreateInputSchema,CollectionKeywordUncheckedCreateInputSchema ]),
}).strict() ;

export const CollectionKeywordUpsertArgsSchema: z.ZodType<Prisma.CollectionKeywordUpsertArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  where: CollectionKeywordWhereUniqueInputSchema,
  create: z.union([ CollectionKeywordCreateInputSchema,CollectionKeywordUncheckedCreateInputSchema ]),
  update: z.union([ CollectionKeywordUpdateInputSchema,CollectionKeywordUncheckedUpdateInputSchema ]),
}).strict() ;

export const CollectionKeywordCreateManyArgsSchema: z.ZodType<Prisma.CollectionKeywordCreateManyArgs> = z.object({
  data: z.union([ CollectionKeywordCreateManyInputSchema,CollectionKeywordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CollectionKeywordCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionKeywordCreateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionKeywordCreateManyInputSchema,CollectionKeywordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CollectionKeywordDeleteArgsSchema: z.ZodType<Prisma.CollectionKeywordDeleteArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  where: CollectionKeywordWhereUniqueInputSchema,
}).strict() ;

export const CollectionKeywordUpdateArgsSchema: z.ZodType<Prisma.CollectionKeywordUpdateArgs> = z.object({
  select: CollectionKeywordSelectSchema.optional(),
  include: CollectionKeywordIncludeSchema.optional(),
  data: z.union([ CollectionKeywordUpdateInputSchema,CollectionKeywordUncheckedUpdateInputSchema ]),
  where: CollectionKeywordWhereUniqueInputSchema,
}).strict() ;

export const CollectionKeywordUpdateManyArgsSchema: z.ZodType<Prisma.CollectionKeywordUpdateManyArgs> = z.object({
  data: z.union([ CollectionKeywordUpdateManyMutationInputSchema,CollectionKeywordUncheckedUpdateManyInputSchema ]),
  where: CollectionKeywordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionKeywordUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionKeywordUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionKeywordUpdateManyMutationInputSchema,CollectionKeywordUncheckedUpdateManyInputSchema ]),
  where: CollectionKeywordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionKeywordDeleteManyArgsSchema: z.ZodType<Prisma.CollectionKeywordDeleteManyArgs> = z.object({
  where: CollectionKeywordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionVideoCreateArgsSchema: z.ZodType<Prisma.CollectionVideoCreateArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  data: z.union([ CollectionVideoCreateInputSchema,CollectionVideoUncheckedCreateInputSchema ]),
}).strict() ;

export const CollectionVideoUpsertArgsSchema: z.ZodType<Prisma.CollectionVideoUpsertArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  where: CollectionVideoWhereUniqueInputSchema,
  create: z.union([ CollectionVideoCreateInputSchema,CollectionVideoUncheckedCreateInputSchema ]),
  update: z.union([ CollectionVideoUpdateInputSchema,CollectionVideoUncheckedUpdateInputSchema ]),
}).strict() ;

export const CollectionVideoCreateManyArgsSchema: z.ZodType<Prisma.CollectionVideoCreateManyArgs> = z.object({
  data: z.union([ CollectionVideoCreateManyInputSchema,CollectionVideoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CollectionVideoCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionVideoCreateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionVideoCreateManyInputSchema,CollectionVideoCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CollectionVideoDeleteArgsSchema: z.ZodType<Prisma.CollectionVideoDeleteArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  where: CollectionVideoWhereUniqueInputSchema,
}).strict() ;

export const CollectionVideoUpdateArgsSchema: z.ZodType<Prisma.CollectionVideoUpdateArgs> = z.object({
  select: CollectionVideoSelectSchema.optional(),
  include: CollectionVideoIncludeSchema.optional(),
  data: z.union([ CollectionVideoUpdateInputSchema,CollectionVideoUncheckedUpdateInputSchema ]),
  where: CollectionVideoWhereUniqueInputSchema,
}).strict() ;

export const CollectionVideoUpdateManyArgsSchema: z.ZodType<Prisma.CollectionVideoUpdateManyArgs> = z.object({
  data: z.union([ CollectionVideoUpdateManyMutationInputSchema,CollectionVideoUncheckedUpdateManyInputSchema ]),
  where: CollectionVideoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionVideoUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.CollectionVideoUpdateManyAndReturnArgs> = z.object({
  data: z.union([ CollectionVideoUpdateManyMutationInputSchema,CollectionVideoUncheckedUpdateManyInputSchema ]),
  where: CollectionVideoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CollectionVideoDeleteManyArgsSchema: z.ZodType<Prisma.CollectionVideoDeleteManyArgs> = z.object({
  where: CollectionVideoWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KeywordCreateArgsSchema: z.ZodType<Prisma.KeywordCreateArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  data: z.union([ KeywordCreateInputSchema,KeywordUncheckedCreateInputSchema ]),
}).strict() ;

export const KeywordUpsertArgsSchema: z.ZodType<Prisma.KeywordUpsertArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema,
  create: z.union([ KeywordCreateInputSchema,KeywordUncheckedCreateInputSchema ]),
  update: z.union([ KeywordUpdateInputSchema,KeywordUncheckedUpdateInputSchema ]),
}).strict() ;

export const KeywordCreateManyArgsSchema: z.ZodType<Prisma.KeywordCreateManyArgs> = z.object({
  data: z.union([ KeywordCreateManyInputSchema,KeywordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const KeywordCreateManyAndReturnArgsSchema: z.ZodType<Prisma.KeywordCreateManyAndReturnArgs> = z.object({
  data: z.union([ KeywordCreateManyInputSchema,KeywordCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const KeywordDeleteArgsSchema: z.ZodType<Prisma.KeywordDeleteArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  where: KeywordWhereUniqueInputSchema,
}).strict() ;

export const KeywordUpdateArgsSchema: z.ZodType<Prisma.KeywordUpdateArgs> = z.object({
  select: KeywordSelectSchema.optional(),
  include: KeywordIncludeSchema.optional(),
  data: z.union([ KeywordUpdateInputSchema,KeywordUncheckedUpdateInputSchema ]),
  where: KeywordWhereUniqueInputSchema,
}).strict() ;

export const KeywordUpdateManyArgsSchema: z.ZodType<Prisma.KeywordUpdateManyArgs> = z.object({
  data: z.union([ KeywordUpdateManyMutationInputSchema,KeywordUncheckedUpdateManyInputSchema ]),
  where: KeywordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KeywordUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.KeywordUpdateManyAndReturnArgs> = z.object({
  data: z.union([ KeywordUpdateManyMutationInputSchema,KeywordUncheckedUpdateManyInputSchema ]),
  where: KeywordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const KeywordDeleteManyArgsSchema: z.ZodType<Prisma.KeywordDeleteManyArgs> = z.object({
  where: KeywordWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;