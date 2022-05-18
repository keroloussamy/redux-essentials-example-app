import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { client } from '../../api/client'

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
}

/*
-First of all when we need to make side tasks/async tasks/unpure functions we should make it out of our reducers.
-So when we need to call api we will make it on a diffrent function out of our reducers.
-We can use something called createAsyncThunk it will help with alot of staff.
-createAsyncThunk take two parameters typePrefix(prefix before ecah type) & payloadCreater(a callback function)
-createAsyncThunk create 3 action types (pending, fulfilled, rejected) and add before each one the typePrefix to make the action type like `posts/fetchPosts/fulfilled` 
-createAsyncThunk create 3 action types using something called ActionCreator it takes the actionType and callback function that takes the payload and return the payload&type/meta. but you don't have to do something with it.
-When you dispatch the createAsyncThunk it will dispatch each action from the 3 actions automaticly.
-So if you want to do something on each action from the 3, you can add them on the extraReducers, because extraReducers only have the actions that doesn't exist on the Slice like here.
*/
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await client.get('/fakeApi/posts')
  return response.data
})

export const addNewPost = createAsyncThunk(
  'posts/addNewPost',
  async (initialPost) => {
    const response = await client.post('/fakeApi/posts', initialPost)
    return response.data
  }
)

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
    /*
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload)
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            date: new Date().toISOString(),
            //Redux actions and state should only contain plain JS values like objects, arrays, and primitives.
            //Don't put class instances, functions, or other non-serializable values into Redux. So we put it on the "prepare callback".
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
    */
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
  /* 
  There are times when a slice reducer needs to respond to other actions that weren't defined as part of this slice's reducers field. 
  We can do that using the slice 'extraReducers' field instead.
  The extraReducers option should be a function that receives a parameter called builder. 
  The builder object provides methods that let us define additional case reducers that will run in response to actions defined outside of the slice. 
  We'll use builder.addCase(actionCreator, reducer) to handle each of the actions dispatched by our async thunks.
  */
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.pending, (state, action) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        // Add any fetched posts to the array
        state.posts = state.posts.concat(action.payload)
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload)
      })
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