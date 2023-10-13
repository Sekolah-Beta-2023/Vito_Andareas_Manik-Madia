import { RowPosts, InsertPosts } from "~/types/posts";

import { RowTags } from "~/types/tags";

const useGetPublicURL = async (URL: string) => {
  const client = useSupabase();
  const { data } = await client.storage.from("madia").getPublicUrl(URL);
  return data.publicUrl;
};

const useUploadCover = async ({
  URL,
  fileImage,
}: {
  URL: string;
  fileImage: File | Blob;
}) => {
  const client = useSupabase();
  const { data, error } = await client.storage
    .from("madia")
    .upload(URL, fileImage);

  return {
    data,
    error,
  };
};

const useInsertPosts = async ({
  user,
  title,
  descriptions,
  cover_image_url,
  tags,
}: InsertPosts) => {
  const client = useSupabase();

  // @ts-ignore
  const { data, count, error, status, statusText } = await client
    .from("posts")
    .insert({
      user,
      title,
      descriptions,
      cover_image_url,
      tags,
    });

  return { data, count, error, status, statusText };
};

// const useFetchAllPosts = async () => {
//   const client = useSupabase();

//   let data: RowPosts[] = [];

//   const {
//     count,
//     data: payload,
//     error,
//     status,
//     statusText,
//   } = await client.from("posts").select(`
//     id,
//     title,
//     cover_image_url,
//     views,
//     tags,
//     posts_url,
//     created_at,
//     user (
//       id,
//       username,
//       name,
//       avatar_url
//     )
//   `);

//   payload && (data = payload as RowPosts[]);

//   // const data = payload && (payload as RowPosts[]);

//   return { count, data, error, status, statusText };
// };

const useFetchAllPosts = async (query?: RowTags) => {
  const client = useSupabase();

  let data: RowPosts[] = [];

  if (!query) {
    const {
      count,
      data: payload,
      error,
      status,
      statusText,
    } = await client.from("posts").select(`
      id,
      title,
      cover_image_url,
      views,
      tags,
      posts_url,
      created_at,
      user (
        id,
        username,
        name,
        avatar_url
      )
    `);

    return {
      count,
      error,

      status,
      statusText,
      data: (data = payload as RowPosts[]),
    };
  } else {
    const {
      count,
      data: payload,
      error,
      status,
      statusText,
    } = await client.from("posts").select(`
      id,
      title,
      cover_image_url,
      views,
      tags,
      posts_url,
      created_at,
      user (
        id,
        username,
        name,
        avatar_url
      )
    `);

    let temp = payload as RowPosts[];

    data = temp.filter((post) =>
      post.tags.map((tag) => tag.tag).includes(query.tag)
    );
    return {
      count,
      error,
      status,
      statusText,
      data,
    };
  }
};

const useFetchSinglePosts = async (id: number) => {
  const client = useSupabase();

  const {
    count,
    data: payload,
    error,
    status,
    statusText,
  } = await client
    .from("posts")
    .select(
      `
    id,
    title,
    cover_image_url,
    views,
    tags,
    descriptions,
    created_at,
    posts_url,
    user (
      username,
      name,
      avatar_url,
      id
    )
    `
    )
    .eq("id", id);

  const data = payload && (payload[0] as RowPosts);

  return { count, data, error, status, statusText };
};

const useFetchPostsByID = async (id: string) => {
  const client = useSupabase();
  let { data: payloads, error } = await client
    .from("posts")
    .select(
      `
      id,
      title,
      cover_image_url,
      views,
      tags,
      descriptions,
      posts_url,
      created_at,
      user (
        username,
        name,
        avatar_url,
        id
      ) 
      `
    )
    .eq("user", id);

  let data = payloads as RowPosts[];
  return {
    data,
    error,
  };
};

const useIncreaseViews = async (id: number) => {
  const client = useSupabase();
  let { data, error } = await client
    // @ts-ignore
    .rpc("increment_view", {
      row_id: id,
    });
};

const useGetListsTags = async () => {
  const client = useSupabase();
  let { data: tags, error } = await client.from("tags").select("*");
  let data = tags as RowTags[];

  return {
    data,
    error,
  };
};

// TODO
const useFetchAllPostsWhereTags = async (tags: string) => {
  const client = useSupabase();
  let { data: payload, error } = await client
    .from("posts")
    .select(`*`)
    .eq("tags", tags);
  let data = payload as RowPosts[];

  return {
    data,
    error,
  };
};

const useCountStarsWherePostID = async (p_post_id: number) => {
  const client = useSupabase();

  let { data, error } = await client
    // @ts-ignore
    .rpc("count_stars_by_post", {
      p_post_id,
    });

  return {
    data,
    error,
  };
};

const useGetAllPostsByTitle = async (title: string) => {
  type QueryPosts = {
    title: string;
    posts_url: string;
    tags: RowTags[];
  };
  const client = useSupabase();

  const { data, error } = await client
    .from("posts")
    .select("title, posts_url, tags")
    .ilike("title", `%${title}%`)
    .limit(10);

  return {
    data: data as QueryPosts[],
    error,
  };
};

const useHandlerStars = async (p_post_id: number, p_user_id: string) => {
  const client = useSupabase();

  // @ts-ignore
  let { data, error } = await client.rpc("insert_or_delete_star", {
    p_post_id,
    p_user_id,
  });

  if (error) console.error(error);
  else console.log(data);
};

const useStatusStars = async (p_post_id: number, p_user_id: string) => {
  const client = useSupabase();

  //@ts-ignore
  let { data, error } = await client.rpc("check_already_star", {
    p_post_id,
    p_user_id,
  });

  return {
    data: data ? (data as boolean) : null,
    error,
  };
};

export const usePosts = () => {
  return {
    useStatusStars,
    useGetListsTags,
    useGetPublicURL,
    useUploadCover,
    useInsertPosts,
    useFetchAllPosts,
    useIncreaseViews,
    useFetchPostsByID,
    useFetchSinglePosts,
    useCountStarsWherePostID,
    useHandlerStars,
    useFetchAllPostsWhereTags,
    useGetAllPostsByTitle,
  };
};
