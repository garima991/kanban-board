import axios from 'axios';

// ~ ~ ~ ~ ~ ~ ~ ~ ~~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ Setup base URL for API requests ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  ~ ~ ~ ~ ~ ~ ~ ~
const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL ?? process.env.BACKEND_API_URL}/api/v1/`,
    withCredentials: true, // Include cookies in requests
});

// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  Add authentication token to headers  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
// NOTE: Since we are using HTTP-only cookies to store the access token,
// we do NOT need to manually attach the token in request headers.
// If you were using localStorage instead, you'd use an interceptor like this:

// axiosInstance.interceptors.request.use(config => {
//     const token = localStorage.getItem('accessToken');
//     if (token) {
//         config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     return config;
// });


// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ No API calls when offline ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

axiosInstance.interceptors.request.use((config) => {
  if (!navigator.onLine) {
    return Promise.reject(new Error("You're offline"));
  }
  return config;
});


// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  Automatically refresh the access token when it expires  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

// axiosInstance.interceptors.response.use(
//     res => res, // If request is successful, return response
//     async (err) => {
//         const originalRequest = err.config;  // Get the failed request
//         if (!navigator.onLine) {
//             // Don’t auto-logout on offline
//             return Promise.reject(err);
//         }

//         // If the error is 401 (Unauthorized) and the request hasn't been retried yet
//         if (err.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;  // Mark the request as retrying

//             try {
//                 // Attempt to refresh the token
//                 await authApi.refreshToken();

//                 // Retry the original request after successful token refresh
//                 return axiosInstance(originalRequest);
//             } catch (refreshError) {
//                 // If refresh failed, log out the user and redirect to login page
//                 await authApi.logout();
//                 window.location.href = '/auth';  // Redirect to login page
//                 return Promise.reject(refreshError);  // Reject the original request
//             }
//         }

//         // If it's not a 401 error, reject the error
//         return Promise.reject(err);
//     }
// );




// ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~  API endpoints ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~

export const boardsApi = {
    createBoard: (boardData) => axiosInstance.post('boards', boardData),
    getBoards: () => axiosInstance.get('boards'),
    getBoardById: (boardId) => axiosInstance.get(`boards/${boardId}`),
    updateBoard: (boardId, boardData) => axiosInstance.patch(`boards/${boardId}`, boardData),
    deleteBoard: (boardId) => axiosInstance.delete(`boards/${boardId}`),
    addMember: (boardId, memberData) => axiosInstance.post(`boards/${boardId}/members`, memberData),
    getBoardMembers: (boardId) => axiosInstance.get(`boards/${boardId}/members`),
    removeMember: (boardId, memberId) => axiosInstance.delete(`boards/${boardId}/members/${memberId}`),

};

export const tasksApi = {
    createTask: (boardId, taskData) => axiosInstance.post(`boards/${boardId}/tasks`, taskData),
    getTasksByBoard: (boardId) => axiosInstance.get(`boards/${boardId}/tasks`),
    getTaskById: (boardId, taskId) => axiosInstance.get(`boards/${boardId}/tasks/${taskId}`),
    updateTask: (boardId, taskId, taskData) => axiosInstance.patch(`boards/${boardId}/tasks/${taskId}`, taskData),
    deleteTask: (boardId, taskId) => axiosInstance.delete(`boards/${boardId}/tasks/${taskId}`),
    addSubtask: (boardId, taskId, subtaskData) => axiosInstance.post(`boards/${boardId}/tasks/${taskId}/subtask`, subtaskData),
    deleteSubtask: (boardId, taskId, subtaskId) => axiosInstance.delete(`boards/${boardId}/tasks/${taskId}/subtask/${subtaskId}`),
    updateSubtask: (boardId, taskId, subtaskId, subtaskData) => axiosInstance.patch(`boards/${boardId}/tasks/${taskId}/subtask/${subtaskId}`, subtaskData),
    assignTask: (boardId, taskId, userId) => axiosInstance.post(`boards/${boardId}/tasks/${taskId}/assign`, { userId }),
    removeTaskMember: (boardId, taskId, userId) => axiosInstance.delete(`boards/${boardId}/tasks/${taskId}/assign/${userId}`),
    changeTaskStatus: (boardId, taskId, status) => axiosInstance.patch(`boards/${boardId}/tasks/${taskId}/status`, { status }),
};

export const authApi = {
    login: (userData) => axiosInstance.post('auth/login', userData),
    register: (userData) => axiosInstance.post('auth/register', userData),
    refreshToken: () => axiosInstance.get('auth/refresh'),
    logout: () => axiosInstance.post('auth/logout'),
    updateAccountDetails: (userData) => axiosInstance.patch('auth/update', userData),
    changePassword: (userData) => axiosInstance.patch('/auth/change-password', userData),
    deleteAccount: () => axiosInstance.delete('auth/delete-account'),
};

export const usersApi = {
    getAllUsers: () => axiosInstance.get('users'),
    getUserById: (userId) => axiosInstance.get(`users/${userId}`),
    searchUsers: (searchTerm) => axiosInstance.get(`users/search?q=${searchTerm}`),
    updateUserRole: (userId, roleData) => axiosInstance.patch(`users/${userId}/role`, roleData),
    getMe: () => axiosInstance.get('users/me')
};


export const globalSearchApi = {
    globalSearch: (searchTerm) => axiosInstance.get(`search?q=${searchTerm}`),
}








