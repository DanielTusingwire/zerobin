# Onboarding & Registration Flows Specification

## Overview

This document outlines the onboarding and registration user flows for the EcoTrack mobile application, ensuring a smooth user experience that aligns with the app's waste management focus and supports both driver and customer user types.

## User Flow Architecture

### 1. Splash Screen

**Purpose:** Brand introduction and app loading

- Display EcoTrack logo with tagline: "Smart Waste Management Solutions"
- Loading indicator while app initializes
- Auto-transition after 2-3 seconds or when loading completes

### 2. Welcome Screen

**Purpose:** User introduction and flow initiation

- Welcome message highlighting key app benefits
- "Get Started" primary CTA button
- Optional "Learn More" secondary button for app overview
- Language selection prompt

### 3. Language Selection

**Purpose:** Localization setup

- Three language options:
  - English (default)
  - Luganda
  - Swahili
- Visual language indicators (flags/text)
- "Continue" button to proceed

### 4. User Type Selection (MVP: Unified Role)

**Purpose:** Determine user journey path

- For MVP: Single "Customer" role
- Future enhancement: "Driver" vs "Customer" selection
- Clear role descriptions with icons
- "Continue as Customer" button

### 5. Registration Options

**Purpose:** Account creation method selection

- Primary: Phone number registration (with Firebase OTP)
- Secondary: Email registration (optional)
- Future: Social login options (Google, Facebook)
- Terms of Service and Privacy Policy links

## Detailed Flow Specifications

### Phone Number Registration Flow

#### Step 1: Phone Input

```
Screen: Phone Number Entry
- Country code selector (default: Uganda +256)
- Phone number input field with validation
- "Send OTP" button
- "Use Email Instead" link
```

#### Step 2: OTP Verification

```
Screen: OTP Verification
- 6-digit OTP input fields
- "Verify" button
- "Resend OTP" link (available after 30 seconds)
- "Change Phone Number" link
- Auto-verification when 6 digits entered
```

#### Step 3: Profile Setup

```
Screen: Profile Information
- Full Name / Business Name input
- Location setup (Google Maps + manual entry)
- Profile photo upload (optional)
- "Complete Registration" button
```

### Email Registration Flow (Optional)

#### Step 1: Email & Password

```
Screen: Email Registration
- Email input with validation
- Password input with strength indicator
- Confirm password field
- "Create Account" button
- "Use Phone Instead" link
```

#### Step 2: Email Verification

```
Screen: Email Verification
- Verification email sent message
- "Resend Email" button
- "Open Email App" button
- Manual verification code input option
```

#### Step 3: Profile Setup

```
Same as phone registration profile setup
```

## Profile Setup Details

### Name Collection

- Single input field: "Full Name" or "Business Name"
- Character limit: 50 characters
- Required field validation
- Real-time character count

### Location Setup

**Primary Method: Google Maps Integration**

- Map view with current location marker
- Search bar for address lookup
- "Use Current Location" button
- Pin drop functionality for precise location

**Fallback Method: Manual Entry**

- Address line 1 (required)
- Address line 2 (optional)
- City/Town (required)
- District/Region dropdown
- Postal code (optional)

### Customer Type (Future Enhancement)

- Radio button selection:
  - Home Customer
  - Business Customer
- Different onboarding paths based on selection
- Business customers: additional fields (business license, waste volume estimates)

## Technical Implementation Requirements

### Firebase Authentication Setup

```javascript
// Phone authentication
const phoneProvider = new firebase.auth.PhoneAuthProvider();
const verificationId = await phoneProvider.verifyPhoneNumber(phoneNumber);

// Email authentication
const emailCredential = await firebase
  .auth()
  .createUserWithEmailAndPassword(email, password);
```

### Data Storage Structure

```javascript
// User profile in Firestore
{
  uid: "user_unique_id",
  profile: {
    name: "John Doe",
    phone: "+256701234567",
    email: "john@example.com",
    location: {
      address: "123 Main Street, Kampala",
      coordinates: {
        latitude: 0.3476,
        longitude: 32.5825
      }
    },
    userType: "customer", // MVP: always "customer"
    language: "en",
    createdAt: timestamp,
    isVerified: true
  }
}
```

### Navigation Flow

```javascript
// React Navigation stack
const OnboardingStack = createStackNavigator({
  Splash: SplashScreen,
  Welcome: WelcomeScreen,
  LanguageSelection: LanguageSelectionScreen,
  UserTypeSelection: UserTypeSelectionScreen, // Future
  RegistrationOptions: RegistrationOptionsScreen,
  PhoneRegistration: PhoneRegistrationScreen,
  OTPVerification: OTPVerificationScreen,
  EmailRegistration: EmailRegistrationScreen,
  ProfileSetup: ProfileSetupScreen,
  LocationSetup: LocationSetupScreen,
});
```

## UI/UX Guidelines

### Design Consistency

- Follow EcoTrack design system colors and typography
- Consistent button styles and spacing
- Progress indicators for multi-step flows
- Clear error states and validation messages

### Accessibility

- Screen reader support for all text elements
- High contrast color ratios
- Touch target sizes minimum 44px
- Keyboard navigation support

### Error Handling

- Network connectivity issues
- Invalid phone numbers/email formats
- OTP timeout scenarios
- Location permission denied
- Camera/photo upload failures

## Validation Rules

### Phone Number

- Valid format for selected country
- Not already registered
- Minimum/maximum length validation

### Email

- Valid email format
- Not already registered
- Domain validation

### Name

- Minimum 2 characters
- Maximum 50 characters
- No special characters except spaces, hyphens, apostrophes

### Location

- Required field
- Coordinate validation if using GPS
- Address format validation for manual entry

## Success Metrics

### Completion Rates

- Splash to Welcome: 95%
- Welcome to Registration: 80%
- Registration Start to Complete: 70%
- Profile Setup Completion: 85%

### Performance Targets

- Splash screen load time: < 3 seconds
- OTP delivery time: < 30 seconds
- Location detection: < 10 seconds
- Overall onboarding time: < 5 minutes

## Future Enhancements

### Phase 2: Driver Onboarding

- Driver license verification
- Vehicle information collection
- Background check integration
- Training module completion

### Phase 3: Business Features

- Business license upload
- Multiple location management
- Team member invitations
- Waste volume estimation tools

### Phase 4: Social Features

- Referral program integration
- Social media sharing
- Community waste challenges
- Eco-impact sharing

## Testing Scenarios

### Happy Path

1. User opens app → sees splash → proceeds through welcome
2. Selects language → chooses registration method
3. Completes phone/email verification
4. Sets up profile with location
5. Successfully enters main app

### Edge Cases

- No internet connection during registration
- Invalid phone number formats
- OTP not received/expired
- Location services disabled
- Camera permission denied
- Incomplete profile information

### Error Recovery

- Clear error messages with actionable steps
- Retry mechanisms for failed operations
- Graceful fallbacks for unavailable features
- Progress preservation across app restarts
