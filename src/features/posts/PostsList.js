import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { PostAuthor } from './PostAuthor'
import { useGetPostsQuery } from '../api/apiSlice'

import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import { Spinner } from '../../components/Spinner'


let PostExcerpt = ({ post }) => {
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
  const {
    data: posts = [], //give posts a default empty array in case it's undefined, so that we always have an array to sort on.
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery()

  const sortedPosts = useMemo(() => { //To avoid re-sorting on every rerender, we can do the sorting in a useMemo() hook.
    const sortedPosts = posts.slice()
    // Sort posts in descending chronological order
    sortedPosts.sort((a, b) => b.date.localeCompare(a.date))
    return sortedPosts
  }, [posts])

  let content

  if (isLoading) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = sortedPosts.map((post) => <PostExcerpt key={post.id} post={post} />)
  } else if (isError) {
    content = <div>{error.toString()}</div>
  }

  return (
    <section className="posts-list">
      <h2>Posts</h2>
      {content}
    </section>
  )
}