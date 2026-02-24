import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Routing from './Routing.tsx'
import {GoogleOAuthProvider} from '@react-oauth/google'

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider 
    clientId='687904482815-6qcgajvipruj3kf9sqf38t29tbssdjv2.apps.googleusercontent.com'>
  <StrictMode>
    <Routing />
  </StrictMode>
  </GoogleOAuthProvider>,
)
