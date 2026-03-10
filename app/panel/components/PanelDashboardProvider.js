"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { DEPARTMENTS } from '../data/panelData';
import { toast } from 'react-hot-toast';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    const [members, setMembers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all panel members from DB
    const fetchMembers = useCallback(async () => {
        try {
            const res = await fetch('/api/panel/members', { cache: 'no-store' });
            if (res.status === 401) {
                setCurrentUser(null);
                localStorage.removeItem('panel_user');
                return;
            }
            const data = await res.json();
            setMembers(data.members || []);
        } catch (error) {
            console.error('Error fetching panel members:', error);
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);
        // Check localStorage for persisted login
        const savedUser = localStorage.getItem('panel_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                setCurrentUser(user);
                // Fetch members since we have a session
                fetchMembers().finally(() => setIsLoading(false));
            } catch {
                localStorage.removeItem('panel_user');
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
        }
    }, [fetchMembers]);

    const isLoggedIn = currentUser !== null;

    const login = async (username, password) => {
        try {
            const res = await fetch('/api/panel/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            const data = await res.json();

            if (data.success && data.user) {
                setCurrentUser(data.user);
                localStorage.setItem('panel_user', JSON.stringify(data.user));
                toast.success(`Welcome, ${data.user.name}!`);
                // Fetch members after login
                await fetchMembers();
                return { success: true };
            }
            return { success: false, error: data.error || 'Invalid credentials' };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed. Please try again.' };
        }
    };

    const logout = async () => {
        try {
            await fetch('/api/panel/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        }
        setCurrentUser(null);
        setMembers([]);
        localStorage.removeItem('panel_user');
        toast.success('Logged out successfully');
    };

    const submitEvaluation = async (targetId, points, note) => {
        try {
            const res = await fetch('/api/panel/evaluation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ targetId, points, note }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success(`Evaluation submitted! ${points > 0 ? '+' : ''}${points}pts`);
            await fetchMembers();
        } catch (error) {
            console.error('Evaluation error:', error);
            toast.error(error.message || 'Failed to submit evaluation');
        }
    };

    const addMember = async (newMemberData) => {
        try {
            const res = await fetch('/api/panel/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMemberData),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success(`Member ${newMemberData.name} added!`);
            await fetchMembers();
        } catch (error) {
            console.error('Add member error:', error);
            toast.error(error.message || 'Failed to add member');
        }
    };

    const updatePassword = async (memberId, newPassword) => {
        try {
            const res = await fetch('/api/panel/members/password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Password updated successfully");
        } catch (error) {
            console.error('Password update error:', error);
            toast.error(error.message || 'Failed to update password');
        }
    };

    const removeMember = async (memberId) => {
        try {
            const res = await fetch(`/api/panel/members?id=${memberId}`, { method: 'DELETE' });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success("Member removed successfully");
            await fetchMembers();
        } catch (error) {
            console.error('Remove member error:', error);
            toast.error(error.message || 'Failed to remove member');
        }
    };

    const getUserById = (id) => {
        // Handle env-admin
        if (id === 'env-admin' && currentUser?.isAdmin) {
            return currentUser;
        }
        return members.find(m => m._id === id);
    };

    if (!isMounted) return null;

    return (
        <DashboardContext.Provider value={{
            members,
            currentUser,
            isLoggedIn,
            isLoading,
            login,
            logout,
            submitEvaluation,
            addMember,
            removeMember,
            updatePassword,
            getUserById,
            fetchMembers,
            DEPARTMENTS
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);
