import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const Panel = () => {
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ email: '', password: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('name, email, role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setUserProfile({
          name: data.name || '',
          email: data.email || '',
          password: '',
          confirmPassword: ''
        });

        setIsAdmin(data.role === 'admin');

        if (data.role === 'admin') fetchUsers();
      } catch (error) {
        setError(error.message);
      }
    };

    fetchProfile();
  }, [user]);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) {
      alert('Error fetching users');
    } else {
      setUsers(data);
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.email || !newUser.password || !newUser.role) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({
      email: newUser.email,
      password: newUser.password
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const { data: createdUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', newUser.email)
      .single();

    if (createdUser) {
      await supabase.from('users').upsert({
        id: createdUser.id,
        email: newUser.email,
        role: newUser.role
      });
    }

    alert('User created successfully');
    setNewUser({ email: '', password: '', role: '' });
    fetchUsers();
    setLoading(false);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (userProfile.password && userProfile.password !== userProfile.confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    const updates = {
      id: user.id,
      name: userProfile.name,
      email: userProfile.email
    };

    const { error: updateError } = await supabase.from('users').upsert(updates);
    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    if (userProfile.password) {
      const { error: passError } = await supabase.auth.updateUser({
        password: userProfile.password
      });
      if (passError) {
        setError(passError.message);
        setLoading(false);
        return;
      }
      alert('Password updated');
    }

    alert('Profile updated successfully');
    setUserProfile((prev) => ({ ...prev, password: '', confirmPassword: '' }));
    setLoading(false);
  };

  return (
    <div>
      <h1>Panel</h1>
      <p>Welcome, {user?.email}</p>
      <button onClick={logout}>Logout</button>

      <h2>Update Profile</h2>
      <form onSubmit={handleProfileUpdate}>
        <input
          type="text"
          placeholder="Name"
          value={userProfile.name}
          onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={userProfile.email}
          onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={userProfile.password}
          onChange={(e) => setUserProfile({ ...userProfile, password: e.target.value })}
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={userProfile.confirmPassword}
          onChange={(e) => setUserProfile({ ...userProfile, confirmPassword: e.target.value })}
        />
        <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Profile'}</button>
      </form>

      {isAdmin && (
        <>
          <h2>Create User</h2>
          <form onSubmit={handleCreateUser}>
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              required
            >
              <option value="">Select role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <button type="submit" disabled={loading}>{loading ? 'Creating...' : 'Create User'}</button>
          </form>

          <h2>All Users</h2>
          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Panel;