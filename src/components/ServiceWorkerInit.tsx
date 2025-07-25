"use client";

import { useEffect } from 'react';

export default function ServiceWorkerInit() {
  useEffect(() => {
    // Initialiser le service worker côté client uniquement
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(function(registration) {
          console.log('Service Worker enregistré:', registration);
        })
        .catch(function(registrationError) {
          console.log('Échec enregistrement Service Worker:', registrationError);
        });
    }
  }, []);

  return null; // Ce composant ne rend rien
}
