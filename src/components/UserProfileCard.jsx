import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";

const UserCard = styled.div`
  margin-top: auto;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px; /* ensures it doesn't shrink */
  border-radius: 50%;
  background: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
`;


const NameRole = styled.div`
  display: flex;
  flex-direction: column;

  .name {
    font-weight: 500;
  }

  .role {
    font-size: 0.8rem;
    color: var(--text-secondary);
    text-transform: capitalize;
  }
`;

const Button = styled.button`
  background-color: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(238, 92, 1, 0.1);
  }
`;

const UserProfileCard = () => {
  const [user, setUser] = useState({ name: 'Admin User', role: 'super admin' });
  const navigate = useNavigate();

  useEffect(() => {
    const stored = sessionStorage.getItem('user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (e) {
        console.error('Failed to parse user session:', e);
      }
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return 'AD';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0];
    return parts[0][0] + parts[1][0];
  };

  const handleLogout = () => {
    // Optional: sessionStorage.removeItem("user");
    navigate("/profile");
  };

  return (
    <UserCard>
      <UserInfo>
        <Avatar>{getInitials(user.name || 'AD')}</Avatar>
        <NameRole>
          <div className="name">{user.name || 'Admin User'}</div>
          <div className="role">{user.role || 'super admin'}</div>
        </NameRole>
      </UserInfo>
      <Button onClick={handleLogout}>Log Out</Button>
    </UserCard>
  );
};

export default UserProfileCard;
