import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/authcontext';  // Assuming this provides userLoggedIn state
import { doCreateUserWithEmailAndPassword } from '../../firebase/auth';  // Firebase auth function

const getErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please try logging in instead.';
    case 'auth/invalid-email':
      return 'The email address is not valid.';
    case 'auth/weak-password':
      return 'The password is too weak. Please choose a stronger password.';
    default:
      return 'An unknown error occurred. Please try again later.';
  }
};

const Register = () => {
  const navigate = useNavigate();  // For navigation after registration
  const { userLoggedIn } = useAuth();  // Access auth context

  // State variables
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form submission handler
  const onSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isRegistering) {
      setIsRegistering(true);
      try {
        await doCreateUserWithEmailAndPassword(email, password);
        navigate('/home');  // Redirect to home after successful registration
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
        setIsRegistering(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 h-full">
      <div className="flex content-center items-center justify-center h-full">
        <div className="w-full lg:w-6/12 px-4">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-moon-light border-0">
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <div className="text-moon-dark text-center mb-3 font-bold">
                <small>Sign up with credentials</small>
              </div>
              <form onSubmit={onSubmit}>
                <div className="relative w-full mb-3">
                  <label className="block uppercase text-moon-dark text-xs font-bold mb-2" htmlFor="name">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="border-0 px-3 py-3 placeholder-moon-grey text-moon-dark bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label className="block uppercase text-moon-dark text-xs font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="border-0 px-3 py-3 placeholder-moon-grey text-moon-dark bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label className="block uppercase text-moon-dark text-xs font-bold mb-2" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="border-0 px-3 py-3 placeholder-moon-grey text-moon-dark bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="relative w-full mb-3">
                  <label className="block uppercase text-moon-dark text-xs font-bold mb-2" htmlFor="confirmPassword">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    className="border-0 px-3 py-3 placeholder-moon-grey text-moon-dark bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>

                <div>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      id="customCheckLogin"
                      type="checkbox"
                      className="form-checkbox border-0 rounded text-moon-dark ml-1 w-5 h-5 ease-linear transition-all duration-150"
                    />
                    <span className="ml-2 text-sm font-semibold text-moon-dark">
                      I agree with the{" "}
                      <a
                        href="#pablo"
                        className="text-moon-blue"
                        onClick={(e) => e.preventDefault()}
                      >
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {errorMessage && (
                  <div className="text-center text-red-500">
                    {errorMessage}
                  </div>
                )}

                <div className="text-center mt-6">
                  <button
                    className={`bg-moon-dark text-moon-light active:bg-moon-light-blue text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150 ${isRegistering ? 'cursor-not-allowed' : ''}`}
                    type="submit"
                    disabled={isRegistering}
                  >
                    {isRegistering ? 'Signing Up...' : 'Create Account'}
                  </button>
                </div>
              </form>
              <div className="text-center mt-6">
                <Link to="/auth/login" className="text-moon-dark text-sm font-bold">
                  Already have an account? Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
