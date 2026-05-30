const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const API_URL = isLocalhost 
    ? 'http://localhost/hansanaaban/api' 
    : 'https://sudesh.sudeshmaths.com/api';

export const apiClient = {
    async request(endpoint, options = {}) {
        const url = `${API_URL}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        const config = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);
            const text = await response.text();
            try {
                const data = JSON.parse(text);
                if (!response.ok) {
                    throw new Error(data.error || 'API Error');
                }
                return data;
            } catch (e) {
                if (response.ok) return text;
                throw new Error('Failed to parse API response');
            }
        } catch (error) {
            console.error(`API Request failed for ${endpoint}:`, error);
            throw error;
        }
    },

    login(index_number) {
        return this.request('/auth.php?action=login', {
            method: 'POST',
            body: JSON.stringify({ index_number }),
        });
    },

    register(index_number, name, institute_name) {
        return this.request('/auth.php?action=register', {
            method: 'POST',
            body: JSON.stringify({ index_number, name, institute_name }),
        });
    },

    getQuizzes() {
        return this.request('/quizzes.php', { method: 'GET' });
    },

    getUsers() {
        return this.request('/users.php', { method: 'GET' });
    },

    createQuiz: async (title, description, is_public = 1) => {
        return apiClient.request('/quizzes.php', {
            method: 'POST',
            body: JSON.stringify({ title, description, is_public }),
        });
    },

    getQuestions: async (quizId, token = null) => {
        let url = `/questions.php?quiz_id=${quizId}`;
        if (token) {
            url += `&token=${token}`;
        }
        return apiClient.request(url, { method: 'GET' });
    },

    getAdminQuestions(quiz_id) {
        return this.request(`/questions.php?quiz_id=${quiz_id}&admin=1`, { method: 'GET' });
    },

    addQuestion(quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option) {
        return this.request('/questions.php', {
            method: 'POST',
            body: JSON.stringify({ quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option }),
        });
    },

    bulkAddQuestions(quiz_id, questions) {
        return this.request('/questions.php', {
            method: 'POST',
            body: JSON.stringify({ action: 'bulk', quiz_id, questions }),
        });
    },

    updateQuestion(id, question_text, option_a, option_b, option_c, option_d, correct_option) {
        return this.request('/questions.php', {
            method: 'PUT',
            body: JSON.stringify({ id, question_text, option_a, option_b, option_c, option_d, correct_option }),
        });
    },

    deleteQuestion(id) {
        return this.request(`/questions.php?id=${id}`, { method: 'DELETE' });
    },

    submitQuiz(userId, quizId, answers, token = null) {
        return this.request('/submit_quiz.php', {
            method: 'POST',
            body: JSON.stringify({ user_id: userId, quiz_id: quizId, answers, token }),
        });
    },

    generateQuizLink(quizId) {
        return this.request('/links.php', {
            method: 'POST',
            body: JSON.stringify({ quiz_id: quizId }),
        });
    },

    validateQuizLink(quizId, token) {
        return this.request(`/links.php?quiz_id=${quizId}&token=${token}`, { method: 'GET' });
    },

    getLeaderboard(quiz_id = null) {
        const url = quiz_id ? `/leaderboard.php?quiz_id=${quiz_id}` : '/leaderboard.php';
        return this.request(url, { method: 'GET' });
    },

    getGroupedLeaderboard() {
        return this.request('/leaderboard.php?action=grouped', { method: 'GET' });
    },

    getUserResults(user_id) {
        return this.request(`/users.php?action=results&user_id=${user_id}`, { method: 'GET' });
    },

    getQuizReview(user_id, quiz_id) {
        return this.request(`/users.php?action=review&user_id=${user_id}&quiz_id=${quiz_id}`, { method: 'GET' });
    },

    getAllUsers() {
        return this.request('/users.php', { method: 'GET' });
    }
};
