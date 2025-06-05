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

export type CreatePostInput = {
  content: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateUserInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type GetInputs = {
  limit: Scalars['Int']['input'];
  page: Scalars['Int']['input'];
};

export type GetPostResponse = {
  __typename?: 'GetPostResponse';
  hashNext?: Maybe<Scalars['Boolean']['output']>;
  posts: Array<Post>;
};

export type GetUsersResponse = {
  __typename?: 'GetUsersResponse';
  hashNext?: Maybe<Scalars['Boolean']['output']>;
  users: Array<User>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createPost: Post;
  createUser: AuthResponse;
  post?: Maybe<PostMutation>;
  signIn: AuthResponse;
  user?: Maybe<UserMutation>;
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


export type MutationSignInArgs = {
  input?: InputMaybe<SignInInput>;
};


export type MutationUserArgs = {
  id: Scalars['Int']['input'];
};

export type Post = {
  __typename?: 'Post';
  author?: Maybe<User>;
  content: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
};

export type PostMutation = {
  __typename?: 'PostMutation';
  deletePost?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['Int']['output'];
  post: Post;
  updatePost?: Maybe<Post>;
  user: User;
};


export type PostMutationUpdatePostArgs = {
  input?: InputMaybe<UpdatePostInput>;
};

export type Query = {
  __typename?: 'Query';
  post?: Maybe<GetPostResponse>;
  user?: Maybe<GetUsersResponse>;
};


export type QueryPostArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  input?: InputMaybe<GetInputs>;
};


export type QueryUserArgs = {
  input?: InputMaybe<GetInputs>;
};

export type SignInInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  GetInputs: GetInputs;
  GetPostResponse: ResolverTypeWrapper<GetPostResponse>;
  GetUsersResponse: ResolverTypeWrapper<GetUsersResponse>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  PostMutation: ResolverTypeWrapper<PostMutation>;
  Query: ResolverTypeWrapper<{}>;
  SignInInput: SignInInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  User: ResolverTypeWrapper<User>;
  UserMutation: ResolverTypeWrapper<UserMutation>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthResponse: AuthResponse;
  Boolean: Scalars['Boolean']['output'];
  CreatePostInput: CreatePostInput;
  CreateUserInput: CreateUserInput;
  GetInputs: GetInputs;
  GetPostResponse: GetPostResponse;
  GetUsersResponse: GetUsersResponse;
  Int: Scalars['Int']['output'];
  Mutation: {};
  Post: Post;
  PostMutation: PostMutation;
  Query: {};
  SignInInput: SignInInput;
  String: Scalars['String']['output'];
  UpdatePostInput: UpdatePostInput;
  UpdateUserInput: UpdateUserInput;
  User: User;
  UserMutation: UserMutation;
};

export type AuthResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = {
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetPostResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetPostResponse'] = ResolversParentTypes['GetPostResponse']> = {
  hashNext?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  posts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type GetUsersResponseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['GetUsersResponse'] = ResolversParentTypes['GetUsersResponse']> = {
  hashNext?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType, Partial<MutationCreatePostArgs>>;
  createUser?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, Partial<MutationCreateUserArgs>>;
  post?: Resolver<Maybe<ResolversTypes['PostMutation']>, ParentType, ContextType, RequireFields<MutationPostArgs, 'id'>>;
  signIn?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, Partial<MutationSignInArgs>>;
  user?: Resolver<Maybe<ResolversTypes['UserMutation']>, ParentType, ContextType, RequireFields<MutationUserArgs, 'id'>>;
};

export type PostResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type PostMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PostMutation'] = ResolversParentTypes['PostMutation']> = {
  deletePost?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  post?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  updatePost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType, Partial<PostMutationUpdatePostArgs>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  post?: Resolver<Maybe<ResolversTypes['GetPostResponse']>, ParentType, ContextType, Partial<QueryPostArgs>>;
  user?: Resolver<Maybe<ResolversTypes['GetUsersResponse']>, ParentType, ContextType, Partial<QueryUserArgs>>;
};

export type UserResolvers<ContextType = Context, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserMutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UserMutation'] = ResolversParentTypes['UserMutation']> = {
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  update?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType, Partial<UserMutationUpdateArgs>>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = Context> = {
  AuthResponse?: AuthResponseResolvers<ContextType>;
  GetPostResponse?: GetPostResponseResolvers<ContextType>;
  GetUsersResponse?: GetUsersResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  PostMutation?: PostMutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  UserMutation?: UserMutationResolvers<ContextType>;
};

