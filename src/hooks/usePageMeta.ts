import { useEffect } from 'react';

export interface PageMeta {
  title: string;
  description: string;
  path?: string;
}

const SITE_NAME = 'DirectHome';
const DEFAULT_OG_IMAGE = '/favicon.png';

export function usePageMeta({ title, description, path = '' }: PageMeta) {
  useEffect(() => {
    document.title = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;

    const setMeta = (name: string, content: string, property = false) => {
      const attr = property ? 'property' : 'name';
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    if (path) {
      const url = `${window.location.origin}${path}`;
      setMeta('og:url', url, true);
    }
    setMeta('og:image', DEFAULT_OG_IMAGE, true);
  }, [title, description, path]);
}
