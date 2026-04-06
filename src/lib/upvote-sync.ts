export const syncUpvoteLogin = (user: any) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('upvote:login', { detail: user }));
  }
};

export const syncUpvoteLogout = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('upvote:logout'));
  }
};
