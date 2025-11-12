import React from 'react';
import { getGithubLoginUrl } from '../api';
import '../styles/pages/LoginPage.css';

const LoginPage: React.FC = () => (
  <div className="login-page">
    <h1>KlpHub</h1>
    <button onClick={() => (window.location.href = getGithubLoginUrl())} className="btn-github">
      Войти через GitHub
    </button>
  </div>
);

export default LoginPage;
