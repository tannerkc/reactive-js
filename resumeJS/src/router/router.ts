// import { Component } from '../core/component';

export type Route = {
  path: string;
  component: () => string;
};

export const createRouter = (routes: Route[], render: (html: string) => void) => {
  const handleLocationChange = () => {
    const path = window.location.pathname;
    const route = routes.find(route => route.path === path);
    if (route) {
      const html = route.component();
      render(html);
    }
  };

  window.addEventListener('popstate', handleLocationChange);

  const navigate = (path: string) => {
    history.pushState({}, '', path);
    handleLocationChange();
  };

  handleLocationChange();

  return { navigate };
};
