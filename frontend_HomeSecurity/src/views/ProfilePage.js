import React, { useState } from 'react';

// Simulated API function to update profile
const updateProfile = async (profileData) => {
  // Replace with your API call
  console.log('Profile updated:', profileData);
};

// Simulated API function to reset password
const resetPassword = async (currentPassword, newPassword) => {
  // Replace with your API call
  console.log('Password reset:', { currentPassword, newPassword });
};

const ProfilePage = () => {
  const [profile, setProfile] = useState({ name: '', email: '' });
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setError('');
    switch (e.target.name) {
      case 'currentPassword':
        setCurrentPassword(e.target.value);
        break;
      case 'newPassword':
        setNewPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(profile);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    await resetPassword(currentPassword, newPassword);
  };

  return (
    <div className='w-full flex flex-col justify-center align-middle items-center '>

    
    <div className="p-6 lg:max-w-[60vw] w-full min-h-screen">
      <h1 className="text-3xl font-bold text-moon-blue mb-6">Profile</h1>
      
      <form onSubmit={handleProfileSubmit} className="mb-8">
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-moon-light-blue">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              className="w-full p-2 bg-moon-light border border-moon-grey rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-moon-light-blue">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              className="w-full p-2 bg-moon-light border border-moon-grey rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="mt-4 bg-moon-blue text-moon-dark p-2 rounded hover:bg-moon-light-blue"
          >
            Update Profile
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label htmlFor="currentPassword" className="block text-moon-light-blue">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={currentPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 bg-moon-light border border-moon-grey rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-moon-light-blue">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 bg-moon-light border border-moon-grey rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-moon-light-blue">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handlePasswordChange}
            className="w-full p-2 bg-moon-light border border-moon-grey rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="mt-4 bg-moon-blue text-moon-dark p-2 rounded hover:bg-moon-light-blue"
        >
          Reset Password
        </button>
      </form>
    </div>

    </div>
  );
};

export default ProfilePage;
