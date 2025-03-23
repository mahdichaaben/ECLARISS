import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../firebase/auth';
import { useAuth } from '../../context/authcontext';

const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/user-disabled':
      return 'The user account has been disabled. Please contact support.';
    case 'auth/user-not-found':
      return 'No user found with this email address. Please check and try again.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    default:
      return 'An unknown error occurred. Please try again later.';
  }
};

const Login = () => {
  const navigate = useNavigate();  // Replace useHistory with useNavigate
  const { currentUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSigningIn) {
      setIsSigningIn(true);
      try {
        await doSignInWithEmailAndPassword(email, password);
        setErrorMessage('');
        navigate('/home');  // Use navigate instead of history.push
      } catch (err) {
        setErrorMessage(getErrorMessage(err));
      } finally {
        setIsSigningIn(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 h-full flex items-center justify-center">
      <div className="w-full lg:w-4/12 px-4">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-moon-light border-0">
          <div className="flex-auto px-4 lg:px-10 py-10">
            <div className="text-moon-blue text-center mb-3 font-bold">
              Sign in with credentials
            </div>
            <form onSubmit={onSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-moon-grey text-xs font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 px-3 py-3 placeholder-moon-grey text-moon-dark bg-moon-light rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>

              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-moon-grey text-xs font-bold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-0 px-3 py-3 placeholder-moon-grey text-moon-dark bg-moon-light rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                />
              </div>

              {errorMessage && (
                <div className="text-center text-red-600 font-bold mb-4">
                  {errorMessage}
                </div>
              )}

              <div className="flex items-center mb-6">
                <input
                  id="customCheckLogin"
                  type="checkbox"
                  className="form-checkbox border-0 rounded text-moon-blue ml-1 w-5 h-5 ease-linear transition-all duration-150"
                />
                <label
                  htmlFor="customCheckLogin"
                  className="ml-2 text-sm font-semibold text-moon-grey"
                >
                  Remember me
                </label>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className={`bg-moon-light-blue text-moon-light active:bg-moon-grey text-sm font-bold uppercase px-6 py-3 rounded shadow outline-none focus:outline-none w-full ease-linear transition-all duration-150 ${isSigningIn ? 'bg-moon-grey cursor-not-allowed' : 'hover:shadow-xl transition duration-300'}`}
                  disabled={isSigningIn}
                >
                  {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
              </div>
            </form>

            <div className="flex flex-wrap mt-6">
              <div className="w-1/2">
                <Link to="#" className="text-moon-blue text-sm font-semibold">
                  <small>Forgot password?</small>
                </Link>
              </div>
              <div className="w-1/2 text-right">
                <Link to="/auth/register" className="text-moon-blue text-sm font-semibold">
                  <small>Create new account</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
