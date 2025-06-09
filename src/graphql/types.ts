import { GraphQLResolveInfo } from 'graphql';
import { Context } from './context';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  token: Scalars['String']['output'];
  user: User;
};

export type Comment = {
  __typename?: 'Comment';
  author: User;
  comment: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  postId: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type CreatePostInput = {
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type GetCommentsResponse = {
  __typename?: 'GetCommentsResponse';
  comments?: Maybe<Array<Comment>>;
  hashNext?: Maybe<Scalars['Boolean']['output']>;
};

export type GetInputs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  createUser: AuthResponse;
  post?: Maybe<PostMutation>;
  sendOtp: SuccessResponse;
  signIn: AuthResponse;
  user?: Maybe<UserMutation>;
  verifyOtp: SuccessResponse;
};


export type MutationCreatePostArgs = {
  input?: InputMaybe<CreatePostInput>;
};


export type MutationCreateUserArgs = {
  input?: InputMaybe<CreateUserInput>;
};


export type MutationPostArgs = {
  id: Scalars['Int']['input'];
};


export type MutationSendOtpArgs = {
  input: SendOtpInput;
};


export type MutationSignInArgs = {
  input?: InputMaybe<SignInInput>;
};


export type MutationUserArgs = {
  id: Scalars['Int']['input'];
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

export enum OtpPurpose {
  Login = 'LOGIN',
  Register = 'REGISTER'
}

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type PostListResponse = {
  __typename?: 'PostListResponse';
  hashNext?: Maybe<Scalars['Boolean']['output']>;
  posts: Array<Post>;
};

export type PostMutation = {
  __typename?: 'PostMutation';
  addComment?: Maybe<Comment>;
  deleteComment?: Maybe<Scalars['Boolean']['output']>;
  deletePost?: Maybe<Scalars['Boolean']['output']>;
  post: Post;
  postId: Scalars['Int']['output'];
  updateComment?: Maybe<Comment>;
  updatePost?: Maybe<Post>;
  user: User;
};


export type PostMutationAddCommentArgs = {
  comment: Scalars['String']['input'];
};


export type PostMutationDeleteCommentArgs = {
  commentId: Scalars['Int']['input'];
};


export type PostMutationUpdateCommentArgs = {
  comment: Scalars['String']['input'];
  commentId: Scalars['Int']['input'];
};


export type PostMutationUpdatePostArgs = {
  input?: InputMaybe<UpdatePostInput>;
};

export type PostQuery = {
  __typename?: 'PostQuery';
  comments?: Maybe<GetCommentsResponse>;
  post: Post;
};


export type PostQueryCommentsArgs = {
  input?: InputMaybe<GetInputs>;
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<PostQuery>;
  postList?: Maybe<PostListResponse>;
  user?: Maybe<UsersResponse>;
};


export type QueryPostArgs = {
  postId: Scalars['Int']['input'];
};


export type QueryPostListArgs = {
  input?: InputMaybe<GetInputs>;
  userId?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  input?: InputMaybe<GetInputs>;
};

export type SendOtpInput = {
  identifier: Scalars['String']['input'];
  purpose: Scalars['String']['input'];
  type: Scalars['String']['input'];
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type SuccessResponse = {
  __typename?: 'SuccessResponse';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type UpdatePostInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserInput = {
  name?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  isActive: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  name: Scalars['String']['output'];
};

export type UserMutation = {
  __typename?: 'UserMutation';
  id: Scalars['Int']['output'];
  update?: Maybe<Scalars['String']['output']>;
};


export type UserMutationUpdateArgs = {
  input?: InputMaybe<UpdateUserInput>;
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  hashNext?: Maybe<Scalars['Boolean']['output']>;
  users: Array<User>;
};

export type VerifyOtpInput = {
  identifier: Scalars['String']['input'];
  otp: Scalars['String']['input'];
  purpose: OtpPurpose;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Comment: ResolverTypeWrapper<Comment>;
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  GetCommentsResponse: ResolverTypeWrapper<GetCommentsResponse>;
  GetInputs: GetInputs;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  OtpPurpose: OtpPurpose;
  Post: ResolverTypeWrapper<Post>;
  PostListResponse: ResolverTypeWrapper<PostListResponse>;
  PostMutation: ResolverTypeWrapper<PostMutation>;
  PostQuery: ResolverTypeWrapper<PostQuery>;
  Query: ResolverTypeWrapper<{}>;
  SendOtpInput: SendOtpInput;
  SignInInput: SignInInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SuccessResponse: ResolverTypeWrapper<SuccessResponse>;
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserMutation: ResolverTypeWrapper<UserMutation>;
  UsersResponse: ResolverTypeWrapper<UsersResponse>;
  VerifyOtpInput: VerifyOtpInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthResponse: AuthResponse;
  Boolean: Scalars['Boolean']['output'];
  Comment: Comment;
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  GetCommentsResponse: GetCommentsResponse;
  GetInputs: GetInputs;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Post: Post;
  PostListResponse: PostListResponse;
  PostMutation: PostMutation;
  PostQuery: PostQuery;
  Query: {};
  SendOtpInput: SendOtpInput;
  SignInInput: SignInInput;
  String: Scalars['String']['output'];
  SuccessResponse: SuccessResponse;
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserMutation: UserMutation;
  UsersResponse: UsersResponse;
  VerifyOtpInput: VerifyOtpInput;
};

export type AuthResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CommentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  author?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetCommentsResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetCommentsResponse'] = ResolversParentTypes['GetCommentsResponse']> = {
  comments?: Resolver<Maybe<Array<ResolversTypes['Comment']>>, ParentType, ContextType>;
  hashNext?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, Partial<MutationCreatePostArgs>>;
  createUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, Partial<MutationCreateUserArgs>>;
  post?: Resolver<Maybe<ResolversTypes['PostMutation']>, ParentType, ContextType, RequireFields<MutationPostArgs, 'id'>>;
  sendOtp?: Resolver<ResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<MutationSendOtpArgs, 'input'>>;
  signIn?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, Partial<MutationSignInArgs>>;
  user?: Resolver<Maybe<ResolversTypes['UserMutation']>, ParentType, ContextType, RequireFields<MutationUserArgs, 'id'>>;
  verifyOtp?: Resolver<ResolversTypes['SuccessResponse'], ParentType, ContextType, RequireFields<MutationVerifyOtpArgs, 'input'>>;
};

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostListResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostListResponse'] = ResolversParentTypes['PostListResponse']> = {
  hashNext?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostMutation'] = ResolversParentTypes['PostMutation']> = {
  addComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<PostMutationAddCommentArgs, 'comment'>>;
  deleteComment?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<PostMutationDeleteCommentArgs, 'commentId'>>;
  deletePost?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  postId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updateComment?: Resolver<Maybe<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<PostMutationUpdateCommentArgs, 'comment' | 'commentId'>>;
  updatePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, Partial<PostMutationUpdatePostArgs>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostQueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostQuery'] = ResolversParentTypes['PostQuery']> = {
  comments?: Resolver<Maybe<ResolversTypes['GetCommentsResponse']>, ParentType, ContextType, Partial<PostQueryCommentsArgs>>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  post?: Resolver<Maybe<ResolversTypes['PostQuery']>, ParentType, ContextType, RequireFields<QueryPostArgs, 'postId'>>;
  postList?: Resolver<Maybe<ResolversTypes['PostListResponse']>, ParentType, ContextType, Partial<QueryPostListArgs>>;
  user?: Resolver<Maybe<ResolversTypes['UsersResponse']>, ParentType, ContextType, Partial<QueryUserArgs>>;
};

export type SuccessResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['SuccessResponse'] = ResolversParentTypes['SuccessResponse']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserMutation'] = ResolversParentTypes['UserMutation']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  update?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<UserMutationUpdateArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UsersResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UsersResponse'] = ResolversParentTypes['UsersResponse']> = {
  hashNext?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AuthResponse?: AuthResponseResolvers<ContextType>;
  Comment?: CommentResolvers<ContextType>;
  GetCommentsResponse?: GetCommentsResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostListResponse?: PostListResponseResolvers<ContextType>;
  PostMutation?: PostMutationResolvers<ContextType>;
  PostQuery?: PostQueryResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SuccessResponse?: SuccessResponseResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserMutation?: UserMutationResolvers<ContextType>;
  UsersResponse?: UsersResponseResolvers<ContextType>;
};

