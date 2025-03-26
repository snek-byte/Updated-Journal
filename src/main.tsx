import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Import Google Fonts
import '@fontsource/inter';
import '@fontsource/playfair-display';
import '@fontsource/montserrat';
import '@fontsource/lora';
import '@fontsource/roboto';
import '@fontsource/open-sans';
import '@fontsource/source-sans-pro';
import '@fontsource/merriweather';
import '@fontsource/poppins';
import '@fontsource/raleway';
import '@fontsource/nunito';
import '@fontsource/quicksand';
import '@fontsource/fira-sans';
import '@fontsource/ubuntu';
import '@fontsource/josefin-sans';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);