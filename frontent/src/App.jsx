import Loginpage from './components/loginpage'
import Signuppage from './components/signuppage'
import Userpage from './components/userpage'
import ImagePostPage from './components/ImagePostPage'
import ChatPage from './components/ChatPage'
import ChatRoom from './components/ChatRoom'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'

 const router=createBrowserRouter(
  [
    {
      path:'/',
      element:
           
              <Loginpage/>
           
    },
    {
      path:'/user/:id',
      element:
            
               <Userpage/>
            
    },
    {
      path:'/signup',
      element:
             
              <Signuppage/>
             

    },
    {
      path:'/posts',
      element:
            <ImagePostPage/>
    },
    {
      path:'/user/chats',
      element:
           <ChatPage/>
    },
    {
      path:'/user/chat/:friendId',
      element:
            <ChatRoom/>
    }
    
  ]
 )

function App() {


  return (
      <div className='outside'>
      <RouterProvider router={router} />
      </div>
     
  )
}

export default App