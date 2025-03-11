
import React from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
