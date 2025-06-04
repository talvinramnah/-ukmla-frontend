# Task Breakdown: Browser Navigation & History Support

This document lists actionable tasks derived from the Navigation PRD. Each task is small, testable, and mapped to the requirements and high-level breakdown in the PRD.

## 1. Audit and Refactor Routing  
**Status:** ⏳ In Progress
- [x] Audit current routing structure and document all major steps/routes
    - **Audit Findings:**
        - The app uses a single Next.js route (`/`) with all major steps managed in React state within `MainFlow`.
        - Major steps/components:
            1. **GameStartScreen** (start screen, shown first)
            2. **AuthModal** (login/signup)
            3. **OnboardingModal** (onboarding)
            4. **MainFlow** (main app logic)
                - **WardSelection** (ward/condition selection)
                - **Chat** (case/chat for selected condition)
                - **PostCaseActions** (after case completion)
                - **ProgressModal** (progress view, modal)
        - Navigation between steps is handled by React state, not by Next.js routes. Browser back/forward buttons do not map to steps.
        - There are no distinct URLs for each step; refreshing always reloads the root and resets state.
- [ ] Refactor app so each major step (ward selection, condition selection, chat, post-case, progress) is a distinct route
    - **Proposed Route Structure:**
        ```
        / (root)
        ├── /start (game start screen)
        ├── /auth (login/signup)
        ├── /onboarding (onboarding flow)
        ├── /wards (ward selection)
        ├── /chat
        │   ├── /[condition] (chat for specific condition)
        │   └── /[condition]/complete (post-case actions)
        └── /progress (progress view)
        ```
    - Each route will:
        1. Handle its own state management
        2. Check auth/onboarding requirements
        3. Support browser back/forward navigation
        4. Persist necessary state in localStorage/cookies
- [ ] Update navigation logic to use `router.push`/`router.replace` as appropriate
- [ ] Ensure browser back/forward buttons move between steps as expected

## 2. Persist Minimal State
- [ ] Implement localStorage or cookies for token persistence
- [ ] Persist current step/selection (ward, condition) in localStorage or cookies
- [ ] On app load, restore state from storage if available
- [ ] Handle state restoration edge cases (e.g., missing/expired tokens)

## 3. Chat Session Management
- [ ] On leaving chat (via back or navigation), discard the current case/thread
- [ ] On entering chat, always start a new case (even for same condition)
- [ ] Test chat discard and new case generation on navigation

## 4. Handle Edge Cases
- [ ] Redirect to login if tokens are missing/expired
- [ ] Redirect to onboarding if onboarding is incomplete
- [ ] Prevent navigation to steps out of order (e.g., can't go to chat before selecting ward/condition)

## 5. Testing
- [ ] Add tests for browser navigation (back/forward) between steps
- [ ] Add tests for chat discard and new case on navigation
- [ ] Add tests for refresh behavior (should stay on current step)
- [ ] Add tests for edge cases (token expiry, incomplete onboarding, out-of-order navigation)

---

**References:**
- [Navigation-PRD.md](./Navigation-PRD.md) 