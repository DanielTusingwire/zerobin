# Onboarding & Registration Flows - Updated Specification

## Overview

Updated onboarding and registration flows for EcoTrack mobile app using email/password authentication with local storage. Phone numbers are collected as profile details, not for authentication.

## User Flow Architecture

### 1. Splash Screen

- EcoTrack logo with tagline: "Smart Waste Management Solutions"
- Loading indicator
- Auto-transition after 2-3 seconds

### 2. Welcome Screen

- Welcome message and app benefits
- "Get Started" button
- Language selection (English, Luganda, Swahili)

### 3. Authentication Choice

- "Sign Up" button (new users)
- "Sign In" button (existing users)
- Terms of Service and Privacy Policy links

## Registration Flow

### Step 1: Email & Password Registration

```
Screen: Sign Up
- Email input with validation
- Password input with strength indicator
- Confirm password field
- "Create Account" button
- "Already have an account? Sign In" link
```

### Step 2: Profile Setup

```
Screen: Profile Setup
- Full Name input (required)
- Phone number input (optional)
- Location setup (Google Maps + manual entry)
- Profile photo upload (optional)
- "Complete Registration" button
```

## Login Flow

### Step 1: Sign In

```
Screen: Sign In
- Email input
- Password input
- "Sign In" button
- "Forgot Password?" link
- "Don't have an account? Sign Up" link
```

## Local Storage Structure

```javascript
// AsyncStorage keys and structure
const USER_DATA = 'user_data';
const AUTH_TOKEN = 'auth_token';

// User data structure
{
  id: "generated_uuid",
  email: "user@example.com",
  password: "hashed_password", // In real app, never store plain passwords
  profile: {
    name: "John Doe",
    phone: "+256701234567", // Optional
    location: {
      address: "123 Main Street, Kampala",
      coordinates: {
        latitude: 0.3476,
        longitude: 32.5825
      }
    },
    profilePhoto: "base64_string_or_uri",
    language: "en",
    userType: "customer",
    createdAt: "2025-01-15T10:30:00Z",
    isProfileComplete: true
  }
}
```

## Technical Implementation

### Authentication Service

```javascript
// services/authService.js
class AuthService {
  async signUp(email, password) {
    // Validate email/password
    // Check if user exists
    // Hash password
    // Store in AsyncStorage
    // Return user data
  }

  async signIn(email, password) {
    // Retrieve user from AsyncStorage
    // Validate credentials
    // Return user data or error
  }

  async signOut() {
    // Clear AsyncStorage
    // Reset app state
  }
}
```

### Validation Rules

- Email: Valid format, not already registered
- Password: Minimum 8 characters, at least 1 uppercase, 1 lowercase, 1 number
- Name: 2-50 characters
- Phone: Optional, valid format if provided

## Screen Components to Build

1. SplashScreen.js
2. WelcomeScreen.js
3. SignUpScreen.js
4. SignInScreen.js
5. ProfileSetupScreen.js
6. LocationSetupScreen.js

Let's start building these components!
