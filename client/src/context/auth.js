const AuthDataProvider = {
  isAuthenticated: true,
  signin(callback) {
    AuthDataProvider.isAuthenticated = true;
    callback();
  },
  signout(callback) {
    AuthDataProvider.isAuthenticated = false;
    callback();
    // setTimeout(callback, 100);
  },
};

export { AuthDataProvider };
