import React from 'react'
import { Link } from 'react-router-dom'

import { PostAuthor } from './PostAuthor'
import { ReactionButtons } from './ReactionButtons'
import { TimeAgo } from './TimeAgo'
import { Spinner } from '../../components/Spinner'
import { useGetPostQuery } from '../api/apiSlice'

export const SinglePostPage = ({ match }) => {
  const { postId } = match.params

  /* 
    useSelector()
    The component will re-render any time the value returned from useSelector changes to a new reference.
    So components should always try to select the smallest possible amount of data they need from the store, which will help ensure that it only renders when it actually needs to.
  */

  const { data: post, isFetching, isSuccess } = useGetPostQuery(postId)

  let content
  if (isFetching) {
    content = <Spinner text="Loading..." />
  } else if (isSuccess) {
    content = (
      <article className="post">
        <h2>{post.title}</h2>
        <div>
          <PostAuthor userId={post.user} />
          <TimeAgo timestamp={post.date} />
        </div>
        <p className="post-content">{post.content}</p>
        <ReactionButtons post={post} />
        <Link to={`/editPost/${post.id}`} className="button">
          Edit Post
        </Link>
      </article>
    )
  }
  return <section>{content}</section>
}