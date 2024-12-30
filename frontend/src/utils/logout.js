const logout = () => {
    // Remove auth token
    localStorage.removeItem('token');

    // Clear any other user data
    localStorage.removeItem('userData');

    // Redirect to login page
    window.location.href = '/login';
};

export default logout;
