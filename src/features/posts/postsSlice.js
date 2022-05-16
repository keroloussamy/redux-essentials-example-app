import { createSlice, nanoid } from '@reduxjs/toolkit'
import { sub } from 'date-fns'

const initialState = [
  {
    id: '1',
    title: 'First Post!',
    content: 'Hello!',
    user: '0',
    date: sub(new Date(), { minutes: 10 }).toISOString(),
  },
  {
    id: '2',
    title: 'Second Post',
    content: 'More text',
    user: '2',
    date: sub(new Date(), { minutes: 5 }).toISOString(),
  },
]

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
        state.push(action.payload)
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
          },
        }
      },
    },
    postUpdated(state, action) {
      const { id, title, content } = action.payload
      const existingPost = state.find((post) => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    },
  },
})

export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer