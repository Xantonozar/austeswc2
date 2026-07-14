"use client";

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { DEPARTMENTS } from '../data/panelData';
import { toast } from 'react-hot-toast';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
    const [members, setMembers] = useState([]);
    const [alumni, setAlumni] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const fetchMembers = useCallback(async () => {
        try {
            const res = await fetch('/api/panel/members?status=active', { cache: 'no-store' });
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

    const fetchAlumni = useCallback(async () => {
        try {
            const res = await fetch('/api/panel/members?status=alumni', { cache: 'no-store' });
            if (!res.ok) return;
            const data = await res.json();
            setAlumni(data.members || []);
        } catch (error) {
            console.error('Error fetching alumni:', error);
        }
    }, []);

    useEffect(() => {
        setIsMounted(true);
        const savedUser = localStorage.getItem('panel_user');
        if (savedUser) {
            try {
                const user = JSON.parse(savedUser);
                // Client-side rank guard
                if (user.rankLevel < 6) {
                    localStorage.removeItem('panel_user');
                    setIsLoading(false);
                    return;
                }
                setCurrentUser(user);
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
        setAlumni([]);
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

    const updateMember = async (memberId, updates) => {
        try {
            const res = await fetch('/api/panel/members', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId, ...updates }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success('Member updated successfully');
            await fetchMembers();
        } catch (error) {
            console.error('Update member error:', error);
            toast.error(error.message || 'Failed to update member');
        }
    };

    const retireMember = async (memberId) => {
        try {
            const res = await fetch('/api/panel/members/retire', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ memberId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);

            toast.success(data.message || 'Member retired to alumni');
            await fetchMembers();
            await fetchAlumni();
        } catch (error) {
            console.error('Retire member error:', error);
            toast.error(error.message || 'Failed to retire member');
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
        if (id === 'env-admin' && currentUser?.isAdmin) {
            return currentUser;
        }
        return members.find(m => m._id === id) || alumni.find(m => m._id === id);
    };

    if (!isMounted) return null;

    return (
        <DashboardContext.Provider value={{
            members,
            alumni,
            currentUser,
            isLoggedIn,
            isLoading,
            login,
            logout,
            submitEvaluation,
            addMember,
            updateMember,
            retireMember,
            removeMember,
            updatePassword,
            getUserById,
            fetchMembers,
            fetchAlumni,
            DEPARTMENTS
        }}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboard = () => useContext(DashboardContext);
