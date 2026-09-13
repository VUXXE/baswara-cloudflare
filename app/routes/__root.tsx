import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import * as React from 'react';
import '../index.css';
import { fetchUser } from '../lib/session';

interface MyRouterContext {
  user: any | null;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    const user = await fetchUser();
    return { user };
  },
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Baswara - Undangan Digital Modern & Elegan' },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Hurricane&family=Indie+Flower&family=Work+Sans:wght@400;500;600;700&family=Caveat:wght@400..700&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Montserrat:ital,wght@0,100..900;1,100..900&family=Lora:ital,wght@0,400..700;1,400..700&family=Outfit:wght@300..700&display=swap',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200',
      },
    ],
  }),
  errorComponent: ({ error }) => {
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h1>Application Error</h1>
        <pre>{error.message}</pre>
        <pre style={{ fontSize: '0.8rem' }}>{error.stack}</pre>
      </div>
    );
  },
  component: RootDocument,
});


function RootDocument() {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}

