import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { selectAllPosts } from './postsSlice'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'


const PostExcerpt = ({ post }) => {
  return (
    <article className="post-excerpt" key={post.id}>
      <h3>{post.title}</h3>
      <div>
        <PostAuthor userId={post.user} />
        <TimeAgo timestamp={post.date} />
      </div>
      <p className="post-content">{post.content.substring(0, 100)}</p>

      <ReactionButtons post={post} />
      <Link to={`/posts/${post.id}`} className="button muted-button">
        View Post
      </Link>
    </article>
  )
}

export const PostsList = () => {
  //React components can read data from the Redux store using the useSelector hook from the React-Redux library
  //The "selector functions" that you write will be called with the entire Redux state object as a parameter, and should return the specific data that this component needs from the store.
  const posts = useSelector(selectAllPosts)

  // Sort posts in reverse chronological order by datetime string
  const orderedPosts = posts.slice().sort((a, b) => b.date.localeCompare(a.date))

  //loop over posts
  const renderedPosts = orderedPosts.map((post) => (
    <PostExcerpt key={post.id} post={post} />
  ))

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {renderedPosts}
    </section>
  )
}