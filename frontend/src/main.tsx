import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import store from './redux/stroe.ts';





createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId='514581652279-fbaei9lba60v675l5qm7lqfm2ck348q5.apps.googleusercontent.com'>
    <BrowserRouter>
  
  <StrictMode>
   <>
   <ToastContainer position="top-center" autoClose={3000} />
   <App />
   </>
   
 </StrictMode>
 </BrowserRouter>

    </GoogleOAuthProvider>
     
 

  </Provider>
 
)
