import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import QuizHistory from './pages/QuizHistory';
import ReviewQuiz from './pages/ReviewQuiz';
import Evaluation from './pages/Evaluation';
import LeaderboardPage from './pages/LeaderboardPage';
import Quiz from './pages/Quiz';
import Admin from './pages/Admin';
import ManageUsers from './pages/ManageUsers';
import Layout from './components/Layout';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/" />;
    if (requireAdmin && String(user.is_admin) !== '1') return <Navigate to="/dashboard" />;
    return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white transition-colors duration-300">
            <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
                path="/dashboard" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/history" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <QuizHistory />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/review/:quizId" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <ReviewQuiz />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/evaluation" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Evaluation />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/leaderboard" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <LeaderboardPage />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/quiz/:quizId" 
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Quiz />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/admin" 
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <Layout>
                            <Admin />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
            <Route 
                path="/admin/users" 
                element={
                    <ProtectedRoute requireAdmin={true}>
                        <Layout>
                            <ManageUsers />
                        </Layout>
                    </ProtectedRoute>
                } 
            />
          </Routes>
          <ToastContainer position="bottom-right" theme="colored" />
        </div>
      </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
