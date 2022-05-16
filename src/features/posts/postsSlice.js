import { createSlice, nanoid } from '@reduxjs/toolkit'


const initialState = {
  posts: [],
  status: 'idle',
  error: null,
}

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    //Here it converts those mutations into safe immutable updates internally using the Immer library.

    /* 
      If an action needs to contain a unique ID or some other random value, always generate that first and put it in the action object. 
      Reducers should never calculate random values, because that makes the results unpredictable.
    */

    /* Fortunately, createSlice lets us define a "prepare callback" function when we write a reducer.
      The "prepare callback" function can take multiple arguments, generate random values like unique IDs,
      and run whatever other synchronous logic is needed to decide what values go into the action object.
      It should then return an object with the `payload` field inside.
      (The return object may also contain a `meta` field, which can be used to add extra descriptive values to the action, 
      and an `error` field, which should be a boolean indicating whether this action represents some kind of an error.)
    */
   
    //More info: https://redux.js.org/tutorials/essentials/part-4-using-data#preparing-action-payloads
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            /* Redux actions and state should only contain plain JS values like objects, arrays, and primitives.
              Don't put class instances, functions, or other non-serializable values into Redux. So we put it on the "prepare callback". */
            title,
            content,
            user: userId,
            reactions: {
              thumbsUp: 0,
              hooray: 0,
              heart: 0,
              rocket: 0,
              eyes: 0,
            },
          },
        }
      },
    },
    reactionAdded(state, action) {
      const { postId, reaction } = action.payload
      const existingPost = state.posts.find((post) => post.id === postId)
      if (existingPost) {
        existingPost.reactions[reaction]++
      }
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.posts.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
})

export const { postAdded, postUpdated, reactionAdded } = postsSlice.actions

export default postsSlice.reducer

/* 
It would be nice if we didn't have to keep rewriting our components every time we made a change to the data format in our reducers (ex using object instead of array).
One way to avoid this is to define reusable selector functions in the slice files,
and have the components use those selectors to extract the data they need instead of repeating the selector logic in each component. 
That way, if we do change our state structure again, we only need to update the code in the slice file
*/

export const selectAllPosts = (state) => state.posts.posts

export const selectPostById = (state, postId) =>
  state.posts.posts.find((post) => post.id === postId)