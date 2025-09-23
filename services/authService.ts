import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

export interface User {
    id: string;
    email: string;
    profile: {
        name: string;
        phone?: string;
        location?: {
            address: string;
            coordinates?: {
                latitude: number;
                longitude: number;
            };
        };
        profilePhoto?: string;
        language: 'en' | 'lg' | 'sw';
        userType: 'customer';
        createdAt: string;
        isProfileComplete: boolean;
    };
}

export interface AuthResponse {
    success: boolean;
    user?: User;
    error?: string;
}

class AuthService {
    private readonly USER_DATA_KEY = 'user_data';
    private readonly USERS_KEY = 'all_users';

    // Generate simple UUID
    private generateId(): string {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Simple password hashing (in production, use proper hashing)
    private hashPassword(password: string): string {
        return btoa(password); // Base64 encoding for demo purposes
    }

    // Validate email format
    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Validate password strength
    private isValidPassword(password: string): boolean {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(password);
    }

    // Get all users from storage
    private async getAllUsers(): Promise<User[]> {
        try {
            const usersData = await AsyncStorage.getItem(this.USERS_KEY);
            return usersData ? JSON.parse(usersData) : [];
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    }

    // Save user to storage
    private async saveUser(user: User): Promise<void> {
        try {
            const users = await this.getAllUsers();
            const existingIndex = users.findIndex(u => u.id === user.id);

            if (existingIndex >= 0) {
                users[existingIndex] = user;
            } else {
                users.push(user);
            }

            await AsyncStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Failed to save user data');
        }
    }

    // Sign up new user
    async signUp(email: string, password: string, confirmPassword: string): Promise<AuthResponse> {
        try {
            // Validate inputs
            if (!email || !password || !confirmPassword) {
                return { success: false, error: 'All fields are required' };
            }

            if (!this.isValidEmail(email)) {
                return { success: false, error: 'Please enter a valid email address' };
            }

            if (!this.isValidPassword(password)) {
                return {
                    success: false,
                    error: 'Password must be at least 8 characters with uppercase, lowercase, and number'
                };
            }

            if (password !== confirmPassword) {
                return { success: false, error: 'Passwords do not match' };
            }

            // Check if user already exists
            const users = await this.getAllUsers();
            const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (existingUser) {
                return { success: false, error: 'An account with this email already exists' };
            }

            // Create new user
            const newUser: User = {
                id: this.generateId(),
                email: email.toLowerCase(),
                profile: {
                    name: '',
                    language: 'en',
                    userType: 'customer',
                    createdAt: new Date().toISOString(),
                    isProfileComplete: false,
                }
            };

            // Save user with hashed password (separate from user object for security)
            await this.saveUser(newUser);
            await AsyncStorage.setItem(`password_${newUser.id}`, this.hashPassword(password));

            // Set current user
            await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(newUser));

            return { success: true, user: newUser };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: 'Failed to create account. Please try again.' };
        }
    }

    // Sign in existing user
    async signIn(email: string, password: string): Promise<AuthResponse> {
        try {
            if (!email || !password) {
                return { success: false, error: 'Email and password are required' };
            }

            const users = await this.getAllUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return { success: false, error: 'No account found with this email' };
            }

            // Check password
            const storedPassword = await AsyncStorage.getItem(`password_${user.id}`);
            if (!storedPassword || storedPassword !== this.hashPassword(password)) {
                return { success: false, error: 'Invalid password' };
            }

            // Set current user
            await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(user));

            return { success: true, user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: 'Failed to sign in. Please try again.' };
        }
    }

    // Get current user
    async getCurrentUser(): Promise<User | null> {
        try {
            const userData = await AsyncStorage.getItem(this.USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error getting current user:', error);
            return null;
        }
    }

    // Update user profile
    async updateProfile(updates: Partial<User['profile']>): Promise<AuthResponse> {
        try {
            const currentUser = await this.getCurrentUser();
            if (!currentUser) {
                return { success: false, error: 'No user logged in' };
            }

            const updatedUser: User = {
                ...currentUser,
                profile: {
                    ...currentUser.profile,
                    ...updates,
                }
            };

            await this.saveUser(updatedUser);
            await AsyncStorage.setItem(this.USER_DATA_KEY, JSON.stringify(updatedUser));

            return { success: true, user: updatedUser };
        } catch (error) {
            console.error('Update profile error:', error);
            return { success: false, error: 'Failed to update profile' };
        }
    }

    // Sign out
    async signOut(): Promise<void> {
        try {
            await AsyncStorage.removeItem(this.USER_DATA_KEY);
        } catch (error) {
            console.error('Sign out error:', error);
        }
    }

    // Check if user is authenticated
    async isAuthenticated(): Promise<boolean> {
        const user = await this.getCurrentUser();
        return user !== null;
    }

    // Reset password (for demo purposes)
    async resetPassword(email: string): Promise<AuthResponse> {
        try {
            const users = await this.getAllUsers();
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

            if (!user) {
                return { success: false, error: 'No account found with this email' };
            }

            // In a real app, you'd send an email here
            Alert.alert(
                'Password Reset',
                'In a real app, a password reset email would be sent to your email address.',
                [{ text: 'OK' }]
            );

            return { success: true };
        } catch (error) {
            console.error('Reset password error:', error);
            return { success: false, error: 'Failed to reset password' };
        }
    }
}

export const authService = new AuthService();