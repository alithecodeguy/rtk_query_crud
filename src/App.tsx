import React from "react";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";

import {
  useGetPostsQuery,
  useAddPostMutation,
  useGetPostQuery,
  useUpdatePostMutation,
  useDeletePostMutation,
} from "./services/pokemon";

function App() {
  const { data: allPosts, error, isLoading: getIsWaiting } = useGetPostsQuery();
  const { data: singlePost } = useGetPostQuery(2);
  const [updatePost, { isLoading: isUpdating }] = useUpdatePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [addPost, { isLoading: addIsPending }] = useAddPostMutation();

  console.log("all posts :");
  console.log(allPosts);
  console.log("post 2 :");
  console.log(singlePost);
  return (
    <div className="App">
      <button
        onClick={(name) =>
          updatePost({
            userId: 101010,
            id: 2,
            title: "ali ali ali",
            body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
          })
        }
      >
        update
      </button>
      <button onClick={(name) => deletePost(2)}>delete</button>
      <button
        onClick={(name) =>
          addPost({
            userId: 123456,
            id: 1,
            title:
              "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
            body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
          })
        }
      >
        add
      </button>
    </div>
  );
}

export default App;
