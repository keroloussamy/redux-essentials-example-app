import { createSlice } from '@reduxjs/toolkit'

const initialState = [
  { id: '1', title: 'First Post!', content: 'Hello!' },
  { id: '2', title: 'Second Post', content: 'More text' },
]

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    //Here it converts those mutations into safe immutable updates internally using the Immer library
    postAdded(state, action) {
      state.push(action.payload)
    }
  },
})

export const { postAdded } = postsSlice.actions

export default postsSlice.reducer