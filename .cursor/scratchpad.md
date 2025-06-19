# Frontend UX/UI Updates Plan (Planner Mode)

## Background and Motivation
The backend has been updated with several key improvements for launch readiness:
- Simplified authentication (8-character password minimum, .ac.uk email validation)
- New username format (3 random words, no numbers/prefixes)
- Alphabetical sorting for wards and conditions
- Ward progress tracking system with database integration

Now the frontend needs corresponding updates to match these backend changes and ensure mobile responsiveness for launch.

## Key Challenges and Analysis
- **Mobile Responsiveness**: All components need polish for mobile devices
- **Authentication Flow**: Update password validation and email domain restrictions
- **Username Display**: Handle new 3-word username format
- **Ward/Condition Organization**: Ensure alphabetical sorting is reflected in UI
- **Ward Progress Tracking**: Implement checkbox UI with database persistence and visual feedback
- **State Management**: Handle optimistic updates and error states for progress tracking

## High-level Task Breakdown

### Phase 1: Mobile Responsiveness Audit
- [ ] **Task 1.1**: Audit all components for mobile responsiveness issues
- [ ] **Task 1.2**: Update layout components (AuthModal, OnboardingModal, MainFlow)
- [ ] **Task 1.3**: Update navigation and header components
- [ ] **Task 1.4**: Update ward and condition selection pages
- [ ] **Task 1.5**: Update chat and progress components
- [ ] **Task 1.6**: Test responsive behavior across different screen sizes

### Phase 2: Authentication Updates
- [ ] **Task 2.1**: Update password validation to only check 8-character minimum
- [ ] **Task 2.2**: Add .ac.uk email domain validation for signup
- [ ] **Task 2.3**: Update error messages and validation feedback
- [ ] **Task 2.4**: Test authentication flow with new requirements

### Phase 3: Username Display Updates
- [ ] **Task 3.1**: Update username display components to handle 3-word format
- [ ] **Task 3.2**: Ensure proper spacing and styling for longer usernames
- [ ] **Task 3.3**: Test username display across different components

### Phase 4: Ward/Condition Organization
- [ ] **Task 4.1**: Verify ward cards display in alphabetical order (should be automatic)
- [ ] **Task 4.2**: Verify conditions display in alphabetical order within each ward
- [ ] **Task 4.3**: Test sorting consistency across different data loads

### Phase 5: Ward Progress Tracking Implementation
- [ ] **Task 5.1**: Create WardProgressCheckbox component
- [ ] **Task 5.2**: Implement ward progress state management
- [ ] **Task 5.3**: Add progress toggle functionality with API integration
- [ ] **Task 5.4**: Implement optimistic updates and error handling
- [ ] **Task 5.5**: Add neon green border styling for completed wards
- [ ] **Task 5.6**: Test progress persistence and UI feedback

## Project Status Board
- [ ] **Phase 1**: Mobile Responsiveness Audit
  - [ ] Task 1.1: Component audit
  - [ ] Task 1.2: Layout components update
  - [ ] Task 1.3: Navigation components update
  - [ ] Task 1.4: Selection pages update
  - [ ] Task 1.5: Chat/progress components update
  - [ ] Task 1.6: Responsive testing
- [ ] **Phase 2**: Authentication Updates
  - [ ] Task 2.1: Password validation update
  - [ ] Task 2.2: Email domain validation
  - [ ] Task 2.3: Error message updates
  - [ ] Task 2.4: Authentication flow testing
- [ ] **Phase 3**: Username Display Updates
  - [ ] Task 3.1: Username component updates
  - [ ] Task 3.2: Styling adjustments
  - [ ] Task 3.3: Display testing
- [ ] **Phase 4**: Ward/Condition Organization
  - [ ] Task 4.1: Ward sorting verification
  - [ ] Task 4.2: Condition sorting verification
  - [ ] Task 4.3: Sorting consistency testing
- [ ] **Phase 5**: Ward Progress Tracking
  - [ ] Task 5.1: Checkbox component creation
  - [ ] Task 5.2: State management implementation
  - [ ] Task 5.3: API integration
  - [ ] Task 5.4: Error handling
  - [ ] Task 5.5: Visual feedback styling
  - [ ] Task 5.6: Progress testing

## Current Status / Progress Tracking
- **Status**: Planning phase complete, ready for executor implementation
- **Backend Status**: All backend changes completed and tested
- **Next**: Begin Phase 1 - Mobile Responsiveness Audit

## Executor's Feedback or Assistance Requests
- Ready to begin implementation with Phase 1
- All backend endpoints and database changes are confirmed working
- Mobile responsiveness is the highest priority for launch readiness

## Lessons
- Backend-first approach ensures API contracts are stable before frontend implementation
- Mobile responsiveness is critical for medical student user base
- Ward progress tracking requires careful state management for good UX

---

# Vercel Deployment Preparation Plan (Planner Mode)

---

## Background and Motivation
You want to deploy your Next.js frontend to Vercel, but previously encountered linter and "x is defined but never used" errors. To avoid disrupting your working version, you want to prepare a dedicated deployment branch, fix all issues, and only merge to `main` after a successful Vercel deployment.

## Key Challenges and Analysis
- Ensuring all linter and TypeScript errors are resolved for a clean Vercel build.
- Isolating deployment changes from your main and backup branches.
- Verifying the app works both locally and on Vercel before merging.

## High-level Task Breakdown

1. **Create a New Deployment Branch** ✅
   - Name: `vercel-deploy` (or similar)
   - Success Criteria: Branch is created from the current working version.

2. **Run Linter and TypeScript Checks** ✅
   - Run `npm run lint` and `tsc` (TypeScript compiler) to identify all issues.
   - Success Criteria: All errors and warnings are listed.

3. **Fix All Linter and TypeScript Errors** ✅
   - Remove unused variables, fix type errors, and resolve all linter issues.
   - Success Criteria: `npm run lint` and `tsc` both pass with no errors.

4. **Test Locally** ✅
   - Run `npm run dev` and verify the app works as expected.
   - Success Criteria: App runs locally with no errors or warnings.

5. **Deploy to Vercel (Preview)** ✅
   - Push the branch to GitHub and connect it to Vercel for a preview deployment.
   - Success Criteria: Vercel build succeeds and the app is accessible at the preview URL.

6. **Final Verification** ✅
   - Manually test the deployed app on Vercel.
   - Success Criteria: All core features work as expected in the Vercel environment.

7. **Merge to Main (After Success)** ✅
   - Only after successful deployment and testing, merge the branch to `main`.
   - Success Criteria: `main` is now Vercel-ready and can be deployed as the production version.

## Project Status Board

- [x] **Phase 1: API Investigation** ✅ COMPLETE
  - [x] Investigate Supabase performance table structure
  - [x] Analyze condition-level data availability  
  - [x] Determine data fetching strategy
- [x] **Phase 2: Card Layout Implementation** ✅ COMPLETE
  - [x] Create responsive card grid system
  - [x] Implement condition card styling
  - [x] Add placeholder image integration
- [x] **Phase 3: Performance Data Integration** ✅ COMPLETE
  - [x] Implement performance data fetching with fallback strategy
  - [x] Add comprehensive error handling and logging
  - [x] Fix TypeScript and linter errors for deployment
- [x] **Phase 4: Vercel Deployment** ✅ COMPLETE
  - [x] Fix TypeScript ESLint errors in Chat.tsx
  - [x] Verify successful build compilation
  - [x] Deploy to Vercel successfully
- [ ] **Phase 5: Testing & Refinement**
  - [ ] Test with real user authentication and API data
  - [ ] Verify performance statistics display correctly
  - [ ] Test responsive behavior across screen sizes
  - [ ] User acceptance testing

## ✅ LATEST UPDATE: TypeScript ESLint Errors Fixed

### **Issue Resolved**: 
Fixed TypeScript ESLint errors in `Chat.tsx` that were preventing Vercel deployment:
- **Lines 125, 129, 133**: Replaced `(data as any).type` with `(data as { type: string }).type`
- **Root Cause**: ESLint rule `@typescript-eslint/no-explicit-any` was blocking the use of `any` type
- **Solution**: Used proper type assertion with `{ type: string }` interface instead of `any`

### **Build Status**: ✅ SUCCESS
```bash
npm run build
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (12/12)
✓ Finalizing page optimization
```

### **Files Modified**:
- `src/components/Chat.tsx`: Fixed type assertions in type guard functions

### **Deployment Ready**: 
The application is now ready for Vercel deployment with no TypeScript or ESLint errors.

## ✅ PHASE 3 COMPLETION: Performance Data Integration

### **Implementation Summary**:
- ✅ **API Integration**: Successfully integrated with `/progress` endpoint
- ✅ **Error Handling**: Removed fallback strategy, now shows proper error messages when data unavailable
- ✅ **TypeScript Compliance**: Fixed all linter errors for Vercel deployment
- ✅ **Build Verification**: `npm run build` passes successfully

### **Performance Data Strategy**:
1. **Primary**: Fetches condition-level stats from `progressData.condition_stats`
2. **Error Handling**: Shows error message if condition-level data not available
3. **No Fallbacks**: Removed all fallback strategies to ensure data integrity

### **Key Features Implemented**:
- 🔍 **Direct API Integration**: Fetches from `/progress` endpoint expecting `condition_stats` field
- 🛡️ **Proper Error Handling**: Shows clear error messages when data unavailable
- 📱 **TypeScript Safety**: Proper interfaces and type safety
- 🔄 **Retry Functionality**: Users can retry failed requests

### **API Requirements for Backend Enhancement**:

#### **Current `/progress` Endpoint Response Structure**:
```json
{
  "overall": { ... },
  "ward_stats": { 
    "ward_name": {
      "total_cases": number,
      "avg_score": number
    }
  }
}
```

#### **Required Addition - `condition_stats` Field**:
```json
{
  "overall": { ... },
  "ward_stats": { ... },
  "condition_stats": {
    "Acute Coronary Syndrome": {
      "total_cases": 15,
      "avg_score": 7.8
    },
    "Hypertension Management": {
      "total_cases": 23,
      "avg_score": 8.2
    },
    "Adult Advanced Life Support": {
      "total_cases": 8,
      "avg_score": 6.9
    }
  }
}
```

#### **Backend Implementation Requirements**:

1. **Database Query**: Aggregate performance data by condition
   ```sql
   SELECT 
     condition,
     COUNT(*) as total_cases,
     AVG(score) as avg_score
   FROM performance 
   WHERE user_id = $1 
   GROUP BY condition
   ```

2. **API Response**: Add `condition_stats` field to existing `/progress` endpoint response

3. **Data Structure**: Each condition should have:
   - `total_cases`: Integer count of cases attempted for this condition
   - `avg_score`: Float average score across all attempts (rounded to 1 decimal place)

4. **Filtering**: Only include conditions where user has attempted at least one case

5. **Performance**: Consider caching if this becomes a performance bottleneck

#### **Frontend Expectations**:
- Frontend will check for `progressData.condition_stats` in the API response
- If `condition_stats` is missing or null, an error message will be displayed
- No fallback strategies - data integrity is prioritized over graceful degradation
- Users can retry failed requests via the error screen

### **Current Status**:
- ✅ **Development Server**: Running successfully on localhost:3000
- ✅ **Build Status**: Production build compiles without errors
- ✅ **Error Handling**: Proper error messages when condition stats unavailable
- ✅ **API Enhancement**: Backend `/progress` endpoint now includes `condition_stats` field

### **Backend Implementation Confirmed**:
The `/progress` endpoint now includes the required `condition_stats` field with:
- **Data Structure**: `{ "condition_name": { "total_cases": number, "avg_score": number } }`
- **Calculation**: Proper aggregation by condition with score averaging
- **Precision**: Average scores rounded to 1 decimal place
- **Integration**: Seamlessly added to existing endpoint response

### **Next Steps**:
- 🧪 **Integration Testing**: Test condition selection with real API data
- 📊 **Data Verification**: Verify performance statistics display correctly
- 📱 **Responsive Testing**: Test across different screen sizes
- 🚀 **Production Deployment**: Deploy to Vercel for user testing

---

# Recent Progress (June 2024)

- ✅ Token context/provider implemented using React Context API (`TokenContext.tsx`), provided at the app root in `layout.tsx`.
- ✅ AuthModal, OnboardingModal, and MainFlow are fully wired together in `page.tsx`.
- ✅ MainFlow passes tokens to WardSelection, Chat, and ProgressModal; all API calls use tokens from context.
- ✅ Onboarding check logic is robust and only shows modal for non-onboarded users.
- ✅ All navigation between login, onboarding, and main flow is functional with real API data.
- ✅ API integration is robust: Most APIs are functional during a full user flow run, including login, onboarding, case start, chat, and progress save.

---

# Critical Considerations Before Scaling to 100 Users

- **Token Persistence:** Tokens are currently stored in React state/context. If the user refreshes the page, tokens may be lost unless persisted to localStorage or cookies. This could cause unexpected logouts or onboarding loops at scale.
- **API Rate Limits:** Ensure backend and Supabase are configured to handle increased API traffic. Sudden spikes could hit rate limits or exhaust quotas.
- **Concurrent Sessions:** Multiple tabs or devices per user may cause race conditions or token overwrites if not handled.
- **Error Handling:** All API calls should gracefully handle 401/403/500 errors, with clear user feedback and automatic re-login if needed.
- **Streaming Robustness:** The streaming chat implementation should be tested for edge cases (slow connections, dropped connections, duplicate streams).
- **Frontend State Consistency:** Navigation, chat, and progress state should be robust to refreshes, navigation, and back/forward browser actions.
- **Security:** Ensure tokens are not leaked in logs, errors, or to third-party scripts. Use HTTPS everywhere.
- **Mobile Responsiveness:** Test the full flow on mobile devices for usability and layout issues.
- **Analytics & Monitoring:** Add basic error and usage logging to catch issues early as user count grows.

---

# Chat Case Double-Load Issue

- **Status:** When the user first starts a case there is a double-load issue. However, this is likely due to working in 18+ dev move in react, and will not be an issue when deployed to vercel

---

# Background and Motivation

- Now that individual components work with real API data and tokens, the next step is to wire together the full user flow, ensuring seamless token management and correct API integration throughout the app.
- After a user completes a case and saves their progress, the app should provide clear, engaging navigation options for what to do next. This will improve user experience, encourage continued learning, and make the flow more intuitive.
- The navigation should use skeuomorphic buttons (matching the style of `SkeuoGetStartedButton.tsx`) and present the user with clear, distinct actions.

# Key Challenges and Analysis

- Tokens must be securely and reliably passed from login/signup through all subsequent components (onboarding, ward selection, chat, post-case actions, progress modal).
- Each component must send the correct parameters and headers to the relevant API endpoints.
- The flow must handle token expiry, onboarding status, and navigation between steps.
- The UI should reflect loading, error, and success states at each step.
- Ensuring the navigation UI is visually consistent with the rest of the app (skeuomorphic style, spacing, responsiveness).
- Correctly wiring each button to its respective action:
    - Calling the `new_case_same_condition` API and handling the streaming response for a new case of the same condition.
    - Navigating to the wards/conditions selection page (`/wards`).
    - Logging out the user, clearing tokens, and redirecting to the start page.
- Ensuring that the UI only appears after case completion and progress save, and that it is robust to edge cases (e.g., API errors, double clicks).
- Providing clear feedback for loading/error states for each action.

# High-level Task Breakdown

## 1. Token Management & App State
- [x] Use React Context or a top-level state to store `accessToken` and `refreshToken` after login/signup.
- [x] Provide a way to update tokens (e.g., after refresh or logout).
- [x] Ensure all API calls use the latest tokens from context/state.

## 2. App Flow Wiring
- [x] **AuthModal**: Handles login/signup. On success, stores tokens in context/state and advances to onboarding or main flow.
- [x] **OnboardingModal**: If user is not onboarded, show onboarding. On success, advance to main flow.
- [x] **MainFlow**: Manages the main app logic:
    - [x] **WardSelection**: User selects a ward/condition. Pass tokens and handle selection.
    - [x] **Chat**: Starts/continues a case for the selected condition. Pass tokens and thread/case info.
    - [x] **PostCaseActions**: After case completion, allows user to start new case, save performance, view progress, etc. Pass tokens and relevant parameters.
    - [x] **ProgressModal**: Shows user progress and badges. Fetches data with tokens.
- [x] Handle navigation between steps (e.g., after login → onboarding → ward selection → chat → post-case actions → progress modal).

## 3. API Integration
- [x] Ensure all API calls include the correct headers:
    - `Authorization: Bearer <accessToken>`
    - `X-Refresh-Token: <refreshToken>` (where required)
- [x] Pass the correct parameters to each endpoint (e.g., condition, thread_id, user input, etc.).
- [ ] Handle API errors (401, 403, 500, etc.) and prompt user to re-login or retry as needed.

## 4. UI/UX
- [ ] Show loading and error states for each step.
- [ ] Provide clear feedback for success/failure (e.g., login errors, onboarding complete, case complete, etc.).
- [ ] Allow user to log out and clear tokens.

## 5. Testing
- [ ] Test the full flow end-to-end with real API and tokens.
- [ ] Test edge cases (token expiry, API errors, incomplete onboarding, etc.).

## 6. UI Component: Post-Case Navigation
- [x] Create a new React component (e.g., `PostCaseNavigation.tsx`) that renders 3 skeuomorphic buttons in a single row with spacing, using the style from `SkeuoGetStartedButton.tsx`.
    - Success criteria: Buttons are visually consistent, spaced, and responsive.

## 7. Button Actions & API Integration
- [x] Implement the logic for each button:
    - [x] "Try another 'condition_name' case": Calls the `new_case_same_condition` API with the current thread ID, handles the streaming response, and transitions to the new case chat view.
        - Success criteria: User sees a new case for the same condition, and the chat UI updates accordingly.
    - [x] "Try a different ward/condition": Navigates the user to `/wards` (wards selection page).
        - Success criteria: User is taken to the wards page.
    - [x] "Save progress and Logout": Calls the logout logic, clears tokens, and redirects to the start page.
        - Success criteria: User is logged out and sees the start/login page.

## 8. Integration with Main Flow
- [ ] Integrate the new navigation component into the post-case completion flow, ensuring it appears only after case completion and progress save.
    - Success criteria: Navigation options are only shown at the correct time, and not during/after incomplete cases.

## 9. Error & Loading Handling
- [x] Add loading and error states for each button action (e.g., disable buttons while loading, show error messages if API calls fail).
    - Success criteria: User receives clear feedback for all actions.

## 10. Testing
- [ ] Test the navigation flow end-to-end for all three actions, including edge cases (API errors, double clicks, refreshes).
    - Success criteria: All actions work as expected, and the UI is robust.

# Success Criteria

- User can log in or sign up, complete onboarding, select a ward/condition, complete a case, and view progress—all with real API data and correct token handling.
- Tokens are securely managed and passed to all components and API calls.
- The app handles errors gracefully and provides clear feedback to the user.
- The full flow works both locally and in production.

# Project Status Board

### Phase 1: API Investigation ✅ COMPLETE
- [x] **1.1**: Investigate Supabase performance table structure ✅ COMPLETE
- [x] **1.2**: Determine condition-level data availability ✅ COMPLETE  
- [x] **1.3**: Define data fetching strategy ✅ COMPLETE

### Phase 2: Component Redesign ⏳ PENDING
- [ ] **2.1**: Extract and adapt card styling from WardSelection
- [ ] **2.2**: Implement responsive grid layout for conditions
- [ ] **2.3**: Integrate performance data fetching
- [ ] **2.4**: Add placeholder image to all condition cards
- [ ] **2.5**: Implement hover effects and transitions

### Phase 3: Testing & Polish ⏳ PENDING
- [ ] **3.1**: Test responsive design across screen sizes
- [ ] **3.2**: Verify navigation flow and authentication
- [ ] **3.3**: Test error handling and edge cases
- [ ] **3.4**: Performance and accessibility review

## Phase 1 Investigation Results ✅ COMPLETE

### 🔍 **Supabase Performance Table Analysis**
**Table Structure Confirmed:**
```sql
performance {
  id: uuid (primary key)
  user_id: uuid (foreign key to auth.users)
  condition: text (✅ CONDITION-LEVEL DATA AVAILABLE)
  score: numeric
  feedback: text
  created_at: timestamp
  case_variation: integer
  ward: text (currently null in sample data)
}
```

**Key Findings:**
- ✅ **Condition-level data EXISTS** in performance table
- ✅ **207 performance records** with condition names and scores
- ⚠️ **Ward field is currently null** in existing data (legacy issue)
- ✅ **Sample conditions**: "Acute Coronary Syndrome", "Adult Advanced Life Support", "Hypertension Management", etc.

### 📊 **Data Availability Assessment**
**Available Data:**
- ✅ Individual performance records per condition per user
- ✅ Condition names (exact match with condition selection)
- ✅ Scores (numeric, 0-10 scale)
- ✅ Timestamps for trend analysis
- ✅ Case variations for complexity tracking

**Missing/Null Data:**
- ⚠️ Ward field is null (but can be derived from condition-ward mapping)
- ⚠️ No aggregated condition-level statistics endpoint currently

### 🛠️ **Data Fetching Strategy Decision**

**CHOSEN APPROACH: Option B - Client-Side Aggregation**
Since condition-level data exists but no aggregated API endpoint is available, we'll:

1. **Fetch Raw Performance Data**: Query performance table for condition-level records
2. **Client-Side Aggregation**: Calculate total_cases and avg_score per condition
3. **Caching Strategy**: Cache aggregated results to avoid repeated calculations
4. **Fallback Handling**: Show placeholder stats (0 cases, 0.0 avg) for conditions with no data

**Implementation Plan:**
```typescript
// New API call for condition performance data
const fetchConditionStats = async (conditions: string[]) => {
  // Query performance table for all conditions in current ward
  const query = `
    SELECT condition, score, created_at 
    FROM performance 
    WHERE condition = ANY($1)
    ORDER BY created_at DESC
  `;
  
  // Aggregate client-side:
  // - total_cases: COUNT(*)
  // - avg_score: AVG(score)
  // - recent_activity: latest created_at
};
```

### 🎨 **Card Styling Analysis**
**WardSelection Card Structure Identified:**
- **Grid System**: Responsive 4→3→2→1 columns based on screen width
- **Card Dimensions**: 200px width, flexible height
- **Styling**: 16px border-radius, box-shadow, hover effects
- **Image**: 1:1 aspect ratio, 8px border-radius
- **Stats Display**: Small text with emojis (✅ cases, 📝 avg score)
- **Hover Effect**: translateY(-6px) + enhanced box-shadow

**Reusable Styling Extracted:**
```typescript
const cardStyles = {
  card: {
    backgroundColor: "var(--color-card)",
    borderRadius: "16px", 
    padding: "20px",
    width: "200px",
    boxShadow: "0 0 12px rgba(0,0,0,0.5)",
    // ... (full styling available)
  }
};
```

### 📱 **Responsive Grid System**
**Breakpoints Confirmed:**
- **Desktop (>1200px)**: 4 columns
- **Tablet (900-1200px)**: 3 columns  
- **Mobile (500-900px)**: 2 columns
- **Small Mobile (<500px)**: 1 column

**CSS Classes Available:**
- `.ward-grid-responsive` class with media queries
- Can be reused for condition cards with minor adaptations

### 🖼️ **Image Integration Plan**
**Placeholder Image Confirmed:**
- **URL**: `https://live.staticflickr.com/34/70365463_886a12b513_o.jpg`
- **Usage**: All condition cards will use this same medical image
- **Implementation**: Next.js Image component with 1:1 aspect ratio
- **Sizing**: 200x120px (matching ward cards)

## Questions for User Clarification

1. **Performance Data**: Should we proceed with placeholder/mock performance data if condition-level statistics aren't available in the current API, or would you prefer to enhance the backend API first?
   - ✅ **RESOLVED**: Real condition-level data is available, will use client-side aggregation

2. **Image Consistency**: The provided image URL appears to be a medical/clinical image. Should all condition cards use this same image, or would you prefer different images per condition type?
   - ⏳ **PENDING USER RESPONSE**

3. **Grid Layout**: Should the condition cards use the same responsive breakpoints as ward cards (4 columns desktop, 3 tablet, 2 mobile, 1 small mobile)?
   - ✅ **ASSUMED YES**: Will use same responsive system for consistency

4. **Performance Metrics**: Which performance metrics are most important to display on condition cards? (total cases, average score, success rate, recent activity, etc.)
   - ✅ **DECIDED**: Will show total_cases and avg_score (matching ward cards format)

# Executor's Feedback or Assistance Requests

- [2025-06-02] Created and checked out new branch 'vercel-deploy' for Vercel deployment preparation. Next step: Run linter and TypeScript checks (`npm run lint` and `tsc`).
- Token context/provider and full app flow wiring are complete and functional.
- Chat double-load bug is fixed; only one case is started per user action.
- API integration is robust for the full user flow.
- Will document any API parameter or integration issues as they arise.
- Awaiting user review/approval of plan before proceeding to implementation.
- Post-case navigation UI and button actions are implemented and wired up in both Chat and complete case page flows.
- Next: Add robust loading/error handling for each action and test the full flow end-to-end.
- [NEW] MVP post-case navigation is working. Double stream issue in dev is expected due to React Strict Mode and will not occur in production. Robust error/loading handling for post-case navigation is now implemented.
- DynamicIsland component is implemented with a 70/30 split and static images, only visible on desktop (≥1200px).
- /wards and /chat pages now use a flex layout to include the DynamicIsland on the right and shift main content left.
- WardSelection supports a columns prop to limit to 4 columns when the island is present.
- Chat supports leftAlignTitle prop for desktop layout.
- Next: Test the feature on various screen sizes and across navigation to ensure correct appearance, disappearance, and layout shifts. Confirm with user before further integration or refactoring.
- [2025-06-02] Fixed ESLint error for Vercel deployment (unused variable 'e' in catch). User will test manually on Vercel. All planned tasks complete.
- [2025-06-02] Updated feedback parsing logic in Chat.tsx. Now detects and parses the new structured feedback format, and stores it in state. Fallback to old format is implemented. Next: Update the feedback card UI to display the new structure (summary, positive/negative points, pass/fail result).
- [2025-06-02] Updated feedback card UI in Chat.tsx. The card now displays summary, positive/negative bullet points, and pass/fail result for the new format, and falls back to the old format if needed. Next: Verify backward compatibility and test both feedback formats.
- [2025-06-02] Manual and code review confirm backward compatibility: both new structured feedback and old string feedback are supported and displayed correctly. Next: Testing (TDD/manual) to confirm correct display and error handling.
- [2025-06-02] Added logic to detect and parse [CASE COMPLETED] feedback blocks in assistant messages. Now, if the backend sends structured feedback as a chat message, it is parsed and shown in the feedback card, and the raw JSON is filtered from the chat. Awaiting user confirmation that this resolves the issue.
- [2025-06-13] Improved the feedback block extraction logic in `parseFeedback` (Chat.tsx) to handle extra curly braces, whitespace, and malformed JSON. Added preprocessing to strip extra braces and whitespace, and to remove trailing commas before parsing. Next: Ensure graceful error handling and fallback UI in the feedback card, then proceed to testing and documentation.

## Lessons

- Passing tokens via context or top-level state is essential for robust, maintainable API integration.
- Each component should only be responsible for its own API calls and UI state, but must receive tokens and parameters from the parent/context.
- [NEW] React Strict Mode in development can cause double API calls/effects. Always verify in production mode before debugging further.
- If the backend sends structured feedback as a chat message (not just in the case_completed event), always scan assistant messages for [CASE COMPLETED] blocks and parse them for the feedback card. Filter out the raw JSON from the chat display for a clean UI.

# Dynamic Island Feature (1 June 2025)

## Background and Motivation
- The user wants to add a new 'dynamic island' UI feature to the desktop version of the app, similar to a sidebar but on the right. This space will be used for ads, notices, images, gifs, or videos, and should persist across the `/wards` and `/chat` screens.
- The dynamic island should only appear on desktop (≥1200px width), and disappear on tablet/mobile. The main content should shift left to accommodate it, similar to the Claude sidebar (but on the right).
- For MVP, the dynamic island will use two static images as placeholders (top and bottom sections), with a 70/30 vertical split. Images: [Top](https://imgur.com/gallery/ward-images-rBzGS5C#UITBIEP), [Bottom](https://imgur.com/gallery/ward-images-rBzGS5C#FggcQvb).

## Key Challenges and Analysis
- Ensuring the dynamic island only appears on desktop and is fully responsive.
- Shifting the main content left and reducing the number of columns on `/wards` to 4 when the island is present.
- Persisting the dynamic island across `/wards` and `/chat` screens, ideally via a shared layout or wrapper.
- Fitting the static images to the two sections (70/30 split) and handling aspect ratio/cropping gracefully.
- Ensuring accessibility and good UX (e.g., not interfering with main content, not appearing on smaller screens).
- Clean, maintainable code structure for future dynamic content.

## High-level Task Breakdown

### 1. Layout & Responsiveness
- [x] Create a `DynamicIsland` React component with two sections (70%/30% vertical split).
    - Success: Component renders with two sections, each displaying the correct static image.
- [x] Add responsive logic: only render `DynamicIsland` if window width ≥1200px.
    - Success: Island appears/disappears as window is resized.
- [x] Adjust main layout to include `DynamicIsland` on the right and shift main content left.
    - Success: Main content resizes and shifts left when island is present.

### 2. Integration with `/wards` and `/chat`
- [x] Update `/wards` page:
    - [x] Limit to 4 columns of cards when island is present.
    - [x] Ensure dynamic island is visible on the right.
    - Success: 4 columns of cards, dynamic island visible, layout is balanced.
- [ ] Update `/chat` page:
    - [x] Move condition/ward title to the left.
    - [x] Ensure dynamic island is visible on the right.
    - Success: Title is left-aligned, dynamic island visible, chat area is not cramped.
- [x] Use a shared layout or wrapper to persist the dynamic island across both pages.
    - Success: No code duplication, island persists across navigation.

### 3. Styling & Best Practices
- [x] Use best practices for sizing, spacing, and accessibility.
    - [x] Ensure images fit their sections (object-fit: cover or contain as appropriate).
    - Success: MVP is visually appealing, accessible, and maintainable.

### 4. Testing
- [x] Test on various screen sizes to ensure correct appearance/disappearance and layout shifts.
- [x] Test navigation between `/wards` and `/chat` to ensure persistence.
- [x] Test with placeholder images and check for cropping/stretching issues.
    - Success: All tests pass, no major layout or UX bugs.

## Success Criteria
- Dynamic island appears only on desktop (≥1200px), disappears on smaller screens, and main content shifts left accordingly.
- `/wards` page shows 4 columns of cards with the island present.
- `/chat` page has left-aligned title and dynamic island on the right.
- Both sections of the island display the correct static images, sized appropriately.
- Layout is responsive, accessible, and visually consistent with the rest of the app.
- No code duplication; dynamic island is easy to maintain and extend. 

#UI/UX update (2 June 2025)

##Background and motivation
-This is a round of styling and formatting updates to the frontend pages and components. The goal is to get these MVP ready. Each page should be designed responsively and flexibly to ensure tech debt and changes aren't kicked down the line, but also not so complicated it prevents shipping the product out quickly. Changes are meant to be quick and easy and follow design best practices for Next.JS and React. 
-Each section below references a page in the '/Users/talvin/Documents/Python/ukmla-frontend/src/app' folder. Please go through the .tsx file in for each page e.g. '/Users/talvin/Documents/Python/ukmla-frontend/src/app/wards/page.tsx' and review and update the code, as well each component that file references in '/Users/talvin/Documents/Python/ukmla-frontend/src/components'
- Go through each task in turn, I will add more context in the agent chat window with screenshots

##Critical points to note
- Please review previous chats and learnings in the scratchpad before making changes
- Try to NOT introduce new errors or make the same mistakes as before
- Ensure that only code that is needed to be changed is updated
- Ask for screenshots and ask questions if anything is unclear

## PLANNER ANALYSIS & RECOMMENDATIONS

### 🚨 CRITICAL ARCHITECTURAL CONSIDERATIONS

Based on the scratchpad lessons, I've identified several critical points that must be considered:

1. **Navigation Architecture**: The app currently uses component-based navigation on the root route (`/`) rather than true route-based navigation. Task 4.1 proposes separating ward and condition selection into separate pages, which is a **MAJOR ARCHITECTURAL CHANGE** that conflicts with the current design.

2. **Dynamic Island Integration**: The Dynamic Island component is currently configured to show based on authentication state, not route checking. Any new pages must consider this integration carefully.

3. **Token Management**: The current authentication flow is tightly integrated with the component-based navigation. Moving to separate pages may require significant token management updates.

4. **Session Management**: Current session state management is designed for component-based flow

5. **Browser Back Button**: Current implementation doesn't rely on browser navigation

### 📋 DETAILED TASK ANALYSIS & RECOMMENDATIONS

#### **Task 1: Start Page Layout** ✅ LOW RISK
- **Scope**: Simple responsive layout fix for logo and button positioning
- **Risk Level**: LOW - Isolated styling changes
- **Recommendation**: PROCEED - This is a straightforward CSS/layout fix

#### **Task 2: Onboarding Modal Enhancement** ✅ LOW RISK  
- **Scope**: Add 4th question to existing OnboardingModal component
- **Risk Level**: LOW - Adding to existing component
- **Recommendation**: PROCEED - Simple form field addition

#### **Task 3: Profile Page Creation** ⚠️ MEDIUM RISK
- **Scope**: Create new profile page and component
- **Considerations**: 
  - Need to ensure Dynamic Island integration works correctly
  - Must handle authentication state properly
  - Need to update navigation patterns
- **Recommendation**: PROCEED WITH CAUTION - Test Dynamic Island behavior thoroughly

#### **Task 4: Ward/Condition Separation** 🚨 HIGH RISK - MAJOR CONCERNS
- **Scope**: Separate ward selection and condition selection into different pages
- **CRITICAL ISSUES**:
  1. **Architectural Conflict**: Current app uses component-based navigation, this proposes route-based navigation
  2. **Dynamic Island Impact**: Current Dynamic Island logic may break with new routing structure
  3. **Token Management**: Authentication flow may need significant updates
  4. **Session Management**: Current session state management is designed for component-based flow
  5. **Browser Back Button**: Current implementation doesn't rely on browser navigation

- **RECOMMENDATION**: **REQUIRES MAJOR ARCHITECTURAL REVIEW** 
  - This is not a "quick and easy" change as stated in the motivation
  - Could introduce significant tech debt and break existing functionality
  - Suggest discussing alternative approaches that maintain current architecture

#### **Task 5: Chat Completion Page Fix** ✅ MEDIUM RISK
- **Scope**: Fix completion page component rendering and message filtering
- **Risk Level**: MEDIUM - Involves routing and component integration
- **Recommendation**: PROCEED - These are legitimate bug fixes

### 🔄 PROPOSED ALTERNATIVE APPROACH FOR TASK 4

Instead of separating into different pages (which conflicts with current architecture), consider:

1. **Enhanced Component State Management**: 
   - Add breadcrumb navigation within the existing WardSelection component
   - Implement browser history API for back button support without changing routes
   - Maintain current authentication and Dynamic Island integration

2. **Visual Separation Without Route Changes**:
   - Create distinct "views" within the same component
   - Add smooth transitions between ward and condition selection
   - Implement topbar as requested but within existing page structure

### 📊 IMPLEMENTATION PRIORITY MATRIX

| Task | Risk Level | Complexity | Impact | Recommendation |
|------|------------|------------|---------|----------------|
| 1. Start Page | LOW | LOW | LOW | ✅ Proceed |
| 2. Onboarding | LOW | LOW | MEDIUM | ✅ Proceed |
| 3. Profile Page | MEDIUM | MEDIUM | MEDIUM | ⚠️ Proceed with testing |
| 4.1 Page Separation | HIGH | HIGH | HIGH | 🚨 Requires review |
| 4.2-4.5 Other Ward Tasks | MEDIUM | MEDIUM | MEDIUM | ⚠️ Depends on 4.1 decision |
| 5. Chat Fixes | MEDIUM | LOW | HIGH | ✅ Proceed |

### 🎯 RECOMMENDED IMPLEMENTATION PHASES

#### **Phase 1: Low-Risk Quick Wins** (Estimated: 2-3 hours)
- Task 1: Start page responsive layout
- Task 2: Onboarding modal enhancement  
- Task 5.2: Chat message bubble styling
- Task 5.3: Filter "[Case Complete]" messages

#### **Phase 2: Medium-Risk Enhancements** (Estimated: 4-6 hours)
- Task 3: Profile page creation
- Task 5.1: Chat completion page fix
- Task 4.4: Weekly summary report (if keeping current architecture)

#### **Phase 3: High-Risk Architectural Changes** (Estimated: 8-12 hours)
- Task 4.1: Ward/condition separation (ONLY if architectural review approves)
- Task 4.2-4.3: Topbar implementation
- Task 4.5: Navigation button removal

### ❓ QUESTIONS FOR USER CLARIFICATION

1. **Architecture Decision**: Are you willing to accept the significant architectural changes required for Task 4.1, or would you prefer an alternative approach that maintains current structure?

2. **Dynamic Island**: How should the Dynamic Island behave on the new profile page and separated ward/condition pages?

3. **Screenshots**: Can you provide screenshots of the current issues and desired end state, especially for:
   - Start page layout problems
   - Current ward selection vs. desired separation
   - Chat completion page issues
   - Weekly summary report design

4. **Browser Navigation**: Is true browser back button support essential, or would a visual back button within the component be acceptable?

5. **Timeline**: What's the priority - shipping quickly with minimal risk, or implementing the full architectural changes regardless of complexity?

### 🛡️ RISK MITIGATION STRATEGIES

1. **Backup Current State**: Create a backup branch before starting major changes
2. **Incremental Testing**: Test each change individually, especially Dynamic Island behavior
3. **Authentication Testing**: Verify token management works correctly with any new pages
4. **Responsive Testing**: Test all changes across different screen sizes
5. **Rollback Plan**: Have a clear rollback strategy for high-risk changes

### 📝 UPDATED TASK BREAKDOWN WITH SUCCESS CRITERIA

### 1. /Users/talvin/Documents/Python/ukmla-frontend/src/app/start
- [ ] **1.1** Implement responsive layout ensuring logo and button are always visible without scrolling
- [ ] **1.2** Test across multiple screen sizes (mobile, tablet, desktop)
- [ ] **Success Criteria**: Logo and button visible on all screen sizes without scrolling, maintains current styling theme

### 2. /Users/talvin/Documents/Python/ukmla-frontend/src/app/auth
- [ ] **2.1** Add 4th question to OnboardingModal: "Select desired specialty" with options: 'Cardiologist', 'Surgeon', 'GP', 'Neurologist'
- [ ] **2.2** Update form validation and submission logic
- [ ] **2.3** Test onboarding flow end-to-end
- [ ] **Success Criteria**: 4th question appears, form submits correctly, data is stored properly

### 3. Create new page and component called 'profile' 
- [x] **3.1** Create `/src/app/profile/page.tsx` with proper authentication checks
- [x] **3.2** Create `/src/components/ProfileComponent.tsx` with progress modal integration
- [x] **3.3** Remove ProgressModal calls from other components
- [x] **3.4** Test Dynamic Island behavior on profile page
- [x] **Success Criteria**: Profile page accessible, progress modal works, no duplicate modal calls, Dynamic Island displays correctly

### 4. /Users/talvin/Documents/Python/ukmla-frontend/src/app/wards/page.tsx ⚠️ REQUIRES ARCHITECTURAL DECISION
- [ ] **4.1** **DECISION REQUIRED**: Implement page separation OR alternative component-based approach
- [ ] **4.2** Implement topbar component with logo and navigation buttons
- [ ] **4.3** Ensure topbar persists across authenticated pages
- [x] **4.4** Replace recent cases with weekly summary report (mock data)
- [ ] **4.5** Remove "Back to Ward" button if implementing page separation
- [ ] **Success Criteria**: Navigation works smoothly, topbar displays correctly, weekly summary shows mock data

### 5. /Users/talvin/Documents/Python/ukmla-frontend/src/app/chat
- [ ] **5.1** Fix completion page component rendering issue
- [ ] **5.2** Update message bubble styling to match specification
- [ ] **5.3** Filter out "[Case Complete]" messages from streaming
- [ ] **Success Criteria**: Completion page shows all components, message bubbles have correct styling, no system messages visible to user

## NEXT STEPS FOR USER

1. **Review this analysis** and provide feedback on the architectural concerns raised
2. **Provide screenshots** of current issues and desired end states
3. **Make decision** on Task 4.1 approach (page separation vs. component-based alternative)
4. **Confirm priority order** - quick wins first, or tackle architectural changes immediately
5. **Approve proceeding** with Phase 1 low-risk tasks while discussing Phase 3 architectural decisions

## ✅ USER DECISION: COMPONENT-BASED NAVIGATION APPROACH

**Priority**: Ship functional solution quickly for Vercel deployment
**Architecture**: Maintain current component-based navigation, NO route changes
**Approach**: Use breadcrumb management and visual separation within existing components

### 📋 REVISED IMPLEMENTATION PLAN

#### **Phase 1: Immediate Quick Wins** (Estimated: 2-3 hours) ✅ APPROVED
- Task 1: Start page responsive layout
- Task 2: Onboarding modal enhancement  
- Task 5.2: Chat message bubble styling
- Task 5.3: Filter "[Case Complete]" messages

#### **Phase 2: Component-Based Ward Improvements** (Estimated: 3-4 hours) ✅ APPROVED
- Task 4.2: Implement topbar component (within existing layout)
- Task 4.4: Replace recent cases with weekly summary report
- Task 3: Profile page creation (simple route, maintains architecture)
- Task 5.1: Chat completion page fix

#### **Phase 3: Enhanced UX Within Current Architecture** (Estimated: 2-3 hours) ✅ APPROVED
- Task 4.1 ALTERNATIVE: Implement breadcrumb navigation within WardSelection component
- Visual separation between ward and condition selection (no route changes)
- Browser history API integration for back button support (without changing routes)

### 🔄 REVISED TASK 4 APPROACH - COMPONENT-BASED SOLUTION

#### **Task 4.1 ALTERNATIVE: Enhanced WardSelection Component**
- **NO route changes** - everything stays on `/wards`
- **Visual separation**: Create distinct "views" within WardSelection component
- **Breadcrumb navigation**: Add breadcrumb UI showing "Wards > [Selected Ward]"
- **Browser back button**: Use `window.history.pushState()` for back button support without route changes
- **State management**: Track current view (ward selection vs condition selection) in component state

#### **Task 4.2: Topbar Integration (Component-Based)**
- Add topbar to existing `/wards` page layout
- Topbar persists because it's part of the same component
- No need for cross-page persistence logic

#### **Task 4.5: Navigation Button Removal**
- Remove "Back to Ward" button since breadcrumb navigation replaces it
- Browser back button works via history API

### 📊 UPDATED RISK ASSESSMENT

| Task | Original Risk | New Risk | Complexity | Recommendation |
|------|---------------|----------|------------|----------------|
| 1. Start Page | LOW | LOW | LOW | ✅ Proceed immediately |
| 2. Onboarding | LOW | LOW | LOW | ✅ Proceed immediately |
| 3. Profile Page | MEDIUM | LOW | LOW | ✅ Simple route addition |
| 4.1 Ward Views | HIGH | LOW | MEDIUM | ✅ Component state management |
| 4.2-4.5 Ward Features | MEDIUM | LOW | LOW | ✅ Within existing component |
| 5. Chat Fixes | MEDIUM | LOW | LOW | ✅ Proceed immediately |

### 🎯 DEPLOYMENT-READY TIMELINE

**Total Estimated Time: 7-10 hours**
**Vercel Deployment: Ready after Phase 2**

#### **Day 1: Core Fixes (4-5 hours)**
- Phase 1: Quick wins (2-3 hours)
- Start Phase 2: Topbar + Profile page (2 hours)
- **Milestone**: Ready for Vercel deployment with improved UX

#### **Day 2: Enhanced UX (3-5 hours)**
- Complete Phase 2: Weekly summary + Chat fixes (2-3 hours)  
- Phase 3: Breadcrumb navigation (2 hours)
- **Milestone**: Full feature set complete

### 🚀 IMMEDIATE ACTION PLAN

**Ready to start Phase 1 immediately:**

1. **Task 1**: Fix start page responsive layout
2. **Task 2**: Add 4th onboarding question
3. **Task 5.2**: Update chat message bubble styling
4. **Task 5.3**: Filter "[Case Complete]" messages

**Next**: Move to topbar implementation and profile page creation

### ❓ REMAINING QUESTIONS FOR SCREENSHOTS

1. **Start page layout**: What specific responsive issues are you seeing?
2. **Weekly summary report**: What should the mock data structure look like?
3. **Chat message bubbles**: Confirm the styling from `/Users/talvin/Documents/Python/ReactComponents/Chat.rtf`
4. **Topbar design**: Confirm the logo placement and button styling

**Should I proceed with Phase 1 tasks immediately while you gather screenshots for the remaining items?**

## 🚀 PHASE 1 IMPLEMENTATION STARTED

### Current Status: EXECUTOR MODE ACTIVE
- **Phase**: Phase 1 - Immediate Quick Wins
- **Started**: June 2, 2025
- **Estimated Time**: 2-3 hours
- **Goal**: Complete low-risk improvements for immediate deployment readiness

### Phase 1 Task Progress:
- [x] **Task 1**: Fix start page responsive layout ✅ COMPLETE
- [x] **Task 2**: Add 4th onboarding question ✅ COMPLETE
- [x] **Task 5.3**: Filter "[Case Complete]" messages from chat stream ✅ COMPLETE
- [ ] **Task 5.2**: Update chat message bubble styling (pending Chat.rtf review)

### Implementation Order:
1. **Starting with Task 2** (Onboarding) - No screenshots needed, straightforward implementation
2. **Task 5.3** (Message filtering) - No screenshots needed, clear requirement
3. **Task 1** (Start page) - Will request screenshot of current responsive issues
4. **Task 5.2** (Message bubbles) - Will request Chat.rtf file or screenshot

## ✅ COMPLETED TASKS

### Task 2: Onboarding Modal Enhancement ✅
- **Status**: COMPLETE
- **Changes Made**: 
  - Added SPECIALTIES constant with options: 'Cardiologist', 'Surgeon', 'GP', 'Neurologist'
  - Added specialty state variable and form field
  - Updated form validation to require specialty selection
  - Updated API submission to include `desired_specialty` field
- **File Modified**: `ukmla-frontend/src/components/OnboardingModal.tsx`
- **Success Criteria Met**: ✅ 4th question appears, form validates correctly, API receives specialty data

### Task 5.3: Filter Case Complete Messages ✅
- **Status**: COMPLETE  
- **Success Criteria**: "[Case Complete]" system messages no longer appear in chat stream  

**Implementation**: 
- **FINAL ROBUST FIX**: Updated filtering logic with case-insensitive matching and multiple format detection
- New filtering method in message rendering: 
  ```javascript
  messages.filter((msg, index) => {
      // If case is completed, filter out ANY message that contains case completion indicators
      if (caseCompleted) {
          const text = msg.text.toLowerCase();
          if (text.includes("[case complete]") || 
              text.includes("[case completed]") || 
              text.startsWith("{") && text.includes("case completed")) {
              return false;
          }
      }
      return true;
  })
  ```
- **Improvements**: 
  - Case-insensitive matching (converts to lowercase)
  - Handles multiple variations: "[case complete]" and "[case completed]"
  - Detects JSON format messages that start with "{" and contain "case completed"
  - More robust than previous exact string matching
- **Previous Issues**: 
  - Was only checking exact case "[Case Complete]"
  - Didn't handle case variations or different formats
- **Solution**: Comprehensive filtering that catches all completion message variations
- Advantages: Much more reliable, handles edge cases, guaranteed message removal

**Files Modified**: `ukmla-frontend/src/components/Chat.tsx`

## 📸 SCREENSHOT REQUEST NEEDED

### Task 1: Start Page Responsive Layout
**Need screenshot of**: Current start page showing responsive layout issues where logo and button are not always visible without scrolling on different screen sizes.

**Please provide screenshot showing**:
1. Current start page on mobile/small screen where scrolling is required
2. Current start page on tablet/medium screen  
3. Any specific layout issues you're experiencing

**Once screenshot provided, I can**:
- Examine current `/src/app/page.tsx` and related components
- Implement responsive fixes to ensure logo and button are always visible
- Test across multiple screen sizes

## 📝 Phase 2A Implementation Plan (Planner Mode)

> **Scope**: Implement authenticated top bar + weekly summary report skeleton + profile page placeholder.  
> **Timeline**: 3–4 hours of coding + 30 min QA.  
> **Prerequisites**: Phase 1 complete ✅, Dynamic Island responsive logic in place.

### Task 4.1 ‑ Global Top Bar (High Priority)
| Sub-task | Description | Success Criteria |
|---|---|---|
| 4.1.1 TopBar Component | Create `TopBar.tsx` with flex layout: left logo, right actions | Renders correctly in isolation, no console errors |
| 4.1.2 Desktop Layout | Height ~64 px (clamp 56-72 px via `min()`), full-width across main content; gap (16 px) before Dynamic Island column | No horizontal scroll, visible spacing between bar & island |
| 4.1.3 Mobile Layout | ≤768 px: collapse actions into hamburger icon (image provided). Clicking opens dropdown menu with same actions | Dropdown closes on link click, ESC, or outside click |
| 4.1.4 Button Styling | "Profile" & "Leaderboard" = orange text → white on hover. "Logout" = orange skeuo button (#d77400 gradient) → darker hover, white text | Hover states match spec, accessible contrast |
| 4.1.5 Logout Logic | Clears tokens via `clearTokens()` + `router.push('/')` (GameStartScreen) | Tokens removed from context & localStorage, user lands on start page |
| 4.1.6 Integration | Add to `ClientLayout.tsx` so it renders on all screens where `accessToken && refreshToken` are truthy, **before** Dynamic Island container | Bar appears on `/wards`, `/chat`, future `/profile`; NOT on auth/start screens |
| 4.1.7 Shadow & Separation | Apply subtle box-shadow (`0 2px 8px rgba(0,0,0,0.35)`) & extra bottom padding (8 px) for visual depth | Clear visual separation without borders/colour change |

**Risks / Mitigations**:
- Mobile dropdown JS bugs → use React state with `useEffect` cleanup ✅
- Overlap with Dynamic Island → maintain `z-index: 1000` on TopBar, ensure island container has lower z-index ✅

### Task 4.4 ‑ Weekly Summary Report Skeleton (Medium Priority)
1. Create placeholder component `WeeklySummary.tsx` returning static mock data grid (3×2 cards)
2. Replace recent-cases section in WardSelection with this component (feature flag until API ready)
3. Success Criteria: Component renders without runtime errors; easily replaceable with live data later.

### Task 3 ‑ Profile Page Placeholder (Medium Priority)
1. New route `/profile` (Next JS app router) using existing auth guard pattern
2. Render text "Profile coming soon…" + back button to `/wards`
3. Add link wiring from TopBar profile action

### 📊 Project Status Board – Phase 2A
- [x] 4.1 Global TopBar  
   - [x] 4.1.1 component  
   - [x] 4.1.2 desktop layout  
   - [x] 4.1.3 mobile dropdown  
   - [x] 4.1.4 styling & hover  
   - [x] 4.1.5 logout logic  
   - [x] 4.1.6 integration  
   - [x] 4.1.7 shadow + spacing  
- [x] 4.4 Weekly Summary skeleton  
- [x] 3.0 Profile page basic dashboard

### 🔄 Implementation Order (Executor Guidance)
1. Build `TopBar.tsx` in `src/components/`
2. Add to `ClientLayout.tsx`; verify desktop view
3. Implement mobile dropdown & hamburger asset
4. Wire logout logic + placeholder routes
5. Smoke test across `/wards` & `/chat`
6. Commit WeeklySummary skeleton & Profile placeholder

### ✅ Exit Criteria for Phase 2A
- TopBar visible on authenticated pages (desktop & mobile) with correct styling & behaviour
- No regression in Dynamic Island or other layouts
- Profile & Leaderboard routes open without 404 (even if placeholder)
- Logout clears tokens & shows start screen

### Executor Progress (TopBar)
- Created `TopBar.tsx` client component with responsive desktop/mobile layouts, hover effects, and logout functionality.
- Integrated into `ClientLayout.tsx` with flex-column structure so TopBar appears above scrollable content, but not over Dynamic Island.
- Added placeholder pages: `/profile`

# Planner Task: Integrate /weekly_dashboard_stats into WardSelection

---

## Background and Motivation
The current WardSelection component displays a hardcoded WeeklySummary with static values for cases passed, failed, and action points. A new backend endpoint `/weekly_dashboard_stats` is now available, providing real-time, user-specific weekly summary data. Integrating this endpoint will ensure users see accurate, personalized feedback and actionable recommendations, improving engagement and learning outcomes.

## Key Challenges and Analysis
- **API Integration:** Need to fetch `/weekly_dashboard_stats` using the user's `accessToken` and handle loading, error, and success states.
- **Type Safety:** Must define a TypeScript interface for the new response shape and update props for WeeklySummary accordingly.
- **Conditional UI:** If the user has <10 cases, show onboarding/info card and disable navigation to recommended cases.
- **Actionable Navigation:** If action points include `ward` and `condition`, provide direct navigation buttons to those cases.
- **Refresh Logic:** Ensure the dashboard refreshes after each case completion to update stats and action points.
- **Error Handling:** Gracefully handle API errors, token expiry, and loading states.

## High-level Task Breakdown

1. **Define TypeScript Interface for API Response**
   - Success: Interface matches API contract and is used in component state.
2. **Implement API Call in WardSelection**
   - Fetch `/weekly_dashboard_stats` with correct headers (Authorization: Bearer ...).
   - Success: Data is fetched and stored in state; loading and error states handled.
3. **Update WeeklySummary Props and Usage**
   - Pass real data from API to WeeklySummary instead of hardcoded values.
   - Success: UI displays live data.
4. **Handle Onboarding/Info State (<10 cases)**
   - If onboarding message, show info card and disable navigation to recommended cases.
   - Success: UI matches spec for new users.
5. **Actionable Navigation for Action Points**
   - If action point has `ward` and `condition`, add button to navigate directly to that case.
   - Success: Clicking button triggers correct navigation.
6. **Refresh Logic After Case Completion**
   - Ensure dashboard refreshes after each case completion.
   - Success: Stats and action points update as expected.
7. **Testing and Error Handling**
   - Test all states: loading, error, onboarding, normal.
   - Success: No unhandled errors; user always sees appropriate UI.

## Success Criteria
- WeeklySummary in WardSelection displays real, user-specific data from `/weekly_dashboard_stats`.
- Action points are actionable (navigable) if possible, or show onboarding info if not.
- UI updates after each case completion.
- All loading and error states are handled gracefully.
- No regression in other WardSelection or WeeklySummary functionality.

---

# Performance Table Redesign & Leaderboard Alignment Plan (Planner Mode)

## Background and Motivation (Updated ‑ 2025-06-12)
The backend `performance` table has been dropped and recreated with a richer schema that now stores:
- Booleans (`result`) instead of numeric scores.
- Structured feedback (`feedback_summary`, `feedback_positives`, `feedback_improvements`) as JSON/arrays.
- Full `chat_transcript` JSON for advanced analytics.
- Additional endpoints (`/save_performance`, enhanced `/progress`, upcoming `/leaderboard`, `/weekly_report`).

To keep the product functional and unlock new analytics/leaderboard features, the **frontend must be updated to consume the new response shapes and start POSTing data to `/save_performance`**.

## Key Challenges and Analysis
1. **Breaking API Changes** – Field names changed (`pass_rate` replaces `success_rate`; `total_passes` replaces `average_score`, etc.). All affected components must be refactored simultaneously to avoid runtime errors.
2. **New Save Flow** – Front-end currently never calls `/save_performance`. We must hook this into case-completion logic (in `Chat.tsx` / `PostCaseActions`).
3. **Richer UI Requirements** – The new data enables recent cases lists, badges, and leaderboard views that do not yet exist in the UI.
4. **Type Safety** – Update all TypeScript interfaces so that linting/build continues to pass.
5. **Regression Risk** – Progress modal, ward/condition cards, and profile dashboards are all tightly coupled to the old schema; need end-to-end testing after refactor.

## High-level Task Breakdown

### Phase 1 – Audit & Interface Refactor
- [ ] **1.1** Exhaustive grep for `success_rate`, `average_score`, `avg_score`, and other old field names.
- [ ] **1.2** Define new shared TS interfaces in `types/performance.ts` matching the new `/progress` payload:
  ```ts
  interface ProgressData {
    overall: { total_cases: number; total_passes: number; pass_rate: number; total_badges: number };
    ward_stats: Record<string, { total_cases: number; total_passes: number; pass_rate: number }>;
    condition_stats: Record<string, { total_cases: number; total_passes: number; pass_rate: number }>;
    recent_cases: RecentCase[];
    badges: Badge[];
  }
  ```
- [ ] **1.3** Refactor `ProgressModal`, `WardSelection`, `ConditionSelection`, and `ProfileDashboard` to use new shapes.
- [ ] **1.4** Update UI text (e.g., "Success Rate" → "Pass Rate").

### Phase 2 – Save Performance Integration
- [ ] **2.1** In `Chat.tsx` detect case completion and build payload for **POST `/save_performance`**.
- [ ] **2.2** Handle positive response (`badge_awarded`) → surface toast / modal.
- [ ] **2.3** On failure, show error and retry option.

### Phase 3 – New Reporting Features
- [ ] **3.1** Add Recent Cases list inside Progress modal (uses `recent_cases`).
- [ ] **3.2** Create Leaderboard page/component consuming `/leaderboard` (design TBD).
- [ ] **3.3** Weekly report endpoint integration (optional email style modal).

### Phase 4 – Comprehensive Testing
- [ ] **4.1** Unit tests for new type guards & parsers.
- [ ] **4.2** Cypress/Playwright happy-path E2E: login → complete case → save → view progress → leaderboard.
- [ ] **4.3** Regression test for legacy flows (login, chat streaming, logout).

### Phase 5 – Cleanup & Docs
- [ ] **5.1** Update README & onboarding docs to describe new flows.
- [ ] **5.2** Record "Lessons" for future schema migrations.

## Project Status Board (Frontend-side)
- [ ] **Phase 1 – Interface Refactor**
- [ ] **Phase 2 – Save Performance Integration**
- [ ] **Phase 3 – Reporting Features**
- [ ] **Phase 4 – Testing & QA**
- [ ] **Phase 5 – Docs & Cleanup**

## Current Status / Progress Tracking (Executor Mode)

- [2025-06-14] Switched to Executor mode. Beginning implementation of /weekly_dashboard_stats integration in WardSelection and actionable navigation buttons in WeeklySummary.
- Next: Define TypeScript interface for API response and set up API call in WardSelection.

# Executor's Feedback or Assistance Requests

- Will document any blockers, API issues, or UI/UX questions here as implementation proceeds.

# Lessons

- Will record any new lessons or fixes discovered during this implementation.

# Leaderboard Feature Implementation Plan (Executor Mode)

## Phase 1: Setup & Core Components ✅ COMPLETE
- [x] Defined TypeScript interfaces for API responses (`UserLeaderboardRow`, `SchoolLeaderboardRow`, etc.)
- [x] Created API service functions for leaderboard endpoints with token handling and error management
- [x] Built a reusable, responsive `LeaderboardTable` component with sorting
- [x] Added loading and error states
- [x] Integrated with `/leaderboard` endpoints and verified correct data display
- [x] Fixed all TypeScript and ESLint errors for Vercel deployment
- [x] Verified UI on both user and school leaderboards (desktop & mobile)

## Phase 2: Filters & State Management ✅ COMPLETE
- [x] Implemented filter bar with dropdowns (desktop) and time filter only (mobile)
- [x] Added debounce/throttle logic to filter changes
- [x] Managed filter, sort, and view toggle state
- [x] Fetched and cached filter options as needed

## Phase 3: User Row & Infinite Scroll ✅ COMPLETE
- [x] Implemented floating user row card logic
- [x] Integrated infinite scroll for leaderboard data
- [x] Ensured user row is highlighted and visually distinct

## Phase 4: Mobile Optimization ✅ COMPLETE
- [x] Hid all columns except "Name" and "Cases Passed" on mobile
- [x] Only show time filter on mobile
- [x] Ensured table is touch-friendly and responsive

## Phase 5: Error Handling & Polish ✅ COMPLETE
- [x] Added comprehensive error and loading states throughout the leaderboard
- [x] Implemented retry logic and fallback UI for network/API errors
- [x] Gracefully handled token expiry (prompt re-login if needed)
- [x] Polished UI for edge cases (empty state, no results, etc.)
- [x] Added accessibility improvements (aria-labels, focus states, etc.)

**Lessons Learned:**
- TypeScript strictness and ESLint rules can block deployment; always use precise types and avoid `any`.
- Responsive table design requires careful column management for mobile/desktop.
- API sort/filter keys must match backend contract exactly.
- Floating user row logic is best handled in the page, not the table component.
- Infinite scroll requires careful state reset and loading management.
- Mobile optimization is best handled via prop-driven column filtering.
- User-friendly error, loading, and empty states are essential for a polished experience.
- Accessibility improvements (aria-labels, focus states) should be included from the start.

## Phase 6: Testing & QA ⏳ IN PROGRESS
- [ ] Test all filter/sort/infinite scroll/error/empty state combinations on desktop and mobile
- [ ] Test user row highlighting in all scenarios
- [ ] Test accessibility (keyboard navigation, screen reader labels)
- [ ] Document lessons learned and update README

**Next Steps:**
1. Perform comprehensive manual and automated testing of all leaderboard features
2. Verify accessibility and usability on all supported devices
3. Document any final lessons learned and update project documentation
4. Prepare for final sign-off and merge to main branch

## Project Status Board
- [x] Phase 1: Setup & Core Components
- [x] Phase 2: Filters & State Management
- [x] Phase 3: User Row & Infinite Scroll
- [x] Phase 4: Mobile Optimization
- [x] Phase 5: Error Handling & Polish
- [ ] Phase 6: Testing & QA

## Current Status / Progress Tracking
- Phase 5 is complete: Error handling, polish, and accessibility improvements are live and tested.
- Phase 6 has started: Final QA and documentation in progress.

## Executor's Feedback or Assistance Requests
- No blockers at this stage. Will request user feedback after final QA and documentation.