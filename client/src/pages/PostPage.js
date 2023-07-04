import { formatISO9075 } from "date-fns";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

export default function PostPage() {
  const [postInfo, setPostInfo] = useState(null);
  const [posts, setPosts] = useState([]);
  const { userInfo } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:4000/post/${id}`).then((response) => {
      response.json().then((postInfo) => {
        setPostInfo(postInfo);
      });
    });
  }, []);

  function handleDelete() {
    fetch(`http://localhost:4000/post/${id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {

          const updatedPosts = posts.filter((post) => post._id !== id);
          setPosts(updatedPosts);

          fetch(`http://localhost:4000/delete/${id}`, {
            method: "POST",
            credentials: "include",
          });

          setPostInfo(null);
        } else {
          console.log("An error occurred while deleting the post");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  if (!postInfo) return "";

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">by @{postInfo.author.username}</div>
      {userInfo.id === postInfo.author._id && (
        <div className="edit-row">
          <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit this post
          </Link>
          <div class="edit-row">
            <a class="delete-btn" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.5 6h17c.28 0 .5.22.5.5v1.26c0 .03.02.05.02.08l-1 12.5c0 .28-.22.5-.5.5h-14c-.28 0-.5-.22-.5-.5l-1-12.5c0-.03.02-.05.02-.08v-1.26c0-.28.22-.5.5-.5zm2 1l1 10.99c0 .01 0 .01-.01.01h10.03s-.01 0-.01-.01l1-10.99h-12zm4-2h4v1h-4zm5 0h4v1h-4zm-8-2h6v1h-6z" />
              </svg>

              Delete it!
            </a>
          </div>
        </div>
      )}
      <div className="image">
        <img src={`http://localhost:4000/post/${postInfo.cover}`} alt="" />
      </div>
      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
}