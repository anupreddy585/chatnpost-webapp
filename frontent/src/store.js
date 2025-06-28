import { configureStore } from '@reduxjs/toolkit'
import loginReducer from './redux/loginSlice.js'
export default configureStore({
  reducer: {
    login:loginReducer,
  },
})