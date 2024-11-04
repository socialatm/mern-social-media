import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts, setUsers } from "state";
import CommentWidget from "./CommentWidget";

/**
 * A React component that renders a newsfeed widget, displaying posts and allowing for user interaction.
 *
 * @param {object} props - The component props.
 * @param {string} props.userId - The ID of the user whose posts should be displayed.
 * @param {boolean} [props.isProfile=false] - Whether the newsfeed is being displayed on a user's profile page.
 * @returns {JSX.Element} - The rendered newsfeed widget.
 */
const NewsfeedWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getUsers = async () => {
    const resposnse = await fetch("http://localhost:3001/users", {
      method:"GET",
      headers: {Authorization:`Bearer ${token}`}
    })
    const users = await resposnse.json()
    dispatch(setUsers(users))
  }
  const getPosts = async () => {
    const response = await fetch("http://localhost:3001/posts", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
      getUsers();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <CommentWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
};

export default NewsfeedWidget;
