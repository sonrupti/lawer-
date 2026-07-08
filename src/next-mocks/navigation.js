export const useRouter = () => {
  return {
    push: (url) => { window.location.href = url; },
    replace: (url) => { window.location.replace(url); },
    prefetch: () => {},
    back: () => { window.history.back(); }
  };
};

export const redirect = (url) => {
  window.location.href = url;
};

export const useSearchParams = () => {
  if (typeof window !== 'undefined') {
    return new URLSearchParams(window.location.search);
  }
  return new URLSearchParams();
};
