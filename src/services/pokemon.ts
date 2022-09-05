// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { Pokemon } from "./types";

export interface Post {
  id: number;
  title: string;
  body: any;
  userId: number;
}

type PostsResponse = Post[];

export const pokemonApi = createApi({
  reducerPath: "postsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://jsonplaceholder.typicode.com/",
  }),
  tagTypes: ["Posts"],
  endpoints: (build) => ({
    getPosts: build.query<PostsResponse, void>({
      query: () => "posts",
      // Provides a list of `Posts` by `id`.
      // If any mutation is executed that `invalidate`s any of these tags, this query will re-run to be always up-to-date.
      // The `LIST` id is a "virtual id" we just made up to be able to invalidate this query specifically if a new `Posts` element was added.
      providesTags: (result) =>
        // is result available?
        result
          ? // successful query
            [
              ...result.map(({ id }) => ({ type: "Posts", id } as const)),
              { type: "Posts", id: "LIST" },
            ]
          : // an error occurred, but we still want to refetch this query when `{ type: 'Posts', id: 'LIST' }` is invalidated
            [{ type: "Posts", id: "LIST" }],
    }),
    addPost: build.mutation<Post, Partial<Post>>({
      query(body) {
        return {
          url: `posts`,
          method: "POST",
          body,
        };
      },
      // Invalidates all Post-type queries providing the `LIST` id - after all, depending of the sort order,
      // that newly created post could show up in any lists.
      invalidatesTags: [{ type: "Posts", id: "LIST" }],
    }),
    getPost: build.query<Post, number>({
      query: (id) => `posts/${id}`,
      providesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
    updatePost: build.mutation<Post, Partial<Post>>({
      query(data) {
        const { id, ...body } = data;
        return {
          url: `posts/${id}`,
          method: "PUT",
          body,
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      // In this case, `getPost` will be re-run. `getPosts` *might*  rerun, if this id was under its results.
      invalidatesTags: (result, error, { id }) => [{ type: "Posts", id }],
    }),
    deletePost: build.mutation<{ success: boolean; id: number }, number>({
      query(id) {
        return {
          url: `posts/${id}`,
          method: "DELETE",
        };
      },
      // Invalidates all queries that subscribe to this Post `id` only.
      invalidatesTags: (result, error, id) => [{ type: "Posts", id }],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useAddPostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} = pokemonApi;
