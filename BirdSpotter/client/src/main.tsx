import ReactDOM from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react';
import App from './components/App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios';
import {CookiesProvider} from 'react-cookie'

const env = (await axios.get(`http://localhost:3000/env`)).data;
console.log(env)
ReactDOM.createRoot(document.getElementById('root')!).render(
        <BrowserRouter>
            <CookiesProvider defaultSetOptions={{path:'/'}}>
                <Auth0Provider
                    domain={env.domain}
                    clientId={env.clientId}
                    authorizationParams={{
                    redirect_uri: window.location.origin
                    }}
                >   
                    <App />
                </Auth0Provider>
            </CookiesProvider>
        </BrowserRouter>
)
