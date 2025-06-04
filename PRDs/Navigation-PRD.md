# Product Requirements Document (PRD)

## Feature: Browser Navigation & History Support

### Background and Motivation
The UKMLA Case Tutor frontend currently allows users to progress through a multi-step flow (login, onboarding, ward selection, condition selection, chat/case, post-case actions, progress view). However, browser navigation (back/forward buttons, refresh) does not always behave as users expect. This can lead to confusion, lost progress, or repeated cases. Improving navigation will make the app feel more native, robust, and user-friendly.

### Goals
- Users can use browser back/forward buttons to navigate between pages/steps (e.g., from condition selection back to ward selection).
- If a user is in a chat and presses back, the chat is discarded. Returning to chat (for the same or a different condition) generates a new case.
- Refreshing the page reloads the current step, not the start page.
- Navigation state is robust to refreshes and browser navigation.

### User Stories
- **As a user**, I want to use the browser back button to return to the previous step (e.g., from condition selection to ward selection) so that navigation feels natural.
- **As a user**, if I leave a chat (via back or navigation), I want the chat to be discarded so that returning always gives me a new case.
- **As a user**, if I refresh the page, I want to stay on the current step, not be sent back to the start.

### Requirements
1. **Browser History Integration**
    - Each major step (ward selection, condition selection, chat, post-case, progress) should be a distinct route in the app (using Next.js routing).
    - Navigating between steps should update the browser history.
    - The back/forward buttons should move between steps as expected.
2. **Chat Session Handling**
    - If the user leaves the chat (via back or navigation), the current chat/case is discarded.
    - Returning to chat (for any condition) always starts a new case.
3. **Page Refresh Handling**
    - Refreshing the page should reload the current step, not reset to the start page.
    - Tokens and minimal state (e.g., current step, selected ward/condition) should persist across refreshes (using localStorage or cookies as needed).
4. **Edge Cases**
    - If tokens are missing/expired, user is redirected to login.
    - If onboarding is incomplete, user is redirected to onboarding.
    - If a user tries to go forward to a step they haven't reached, redirect to the correct step.

### Success Criteria
- [ ] Users can navigate back/forward between steps using browser buttons.
- [ ] Leaving chat and returning always starts a new case.
- [ ] Refreshing the page keeps the user on the current step.
- [ ] No regressions in login, onboarding, or API integration.
- [ ] All navigation flows are covered by tests.

### High-level Task Breakdown
1. **Audit and Refactor Routing**
    - Ensure each step is a distinct route (Next.js pages or dynamic routes).
    - Update navigation logic to use router.push/replace as appropriate.
2. **Persist Minimal State**
    - Store tokens and current step/selection in localStorage or cookies.
    - On app load, restore state from storage if available.
3. **Chat Session Management**
    - On leaving chat, discard the current case/thread.
    - On entering chat, always start a new case.
4. **Handle Edge Cases**
    - Redirect to login if tokens are missing/expired.
    - Redirect to onboarding if not complete.
    - Prevent navigation to steps out of order.
5. **Testing**
    - Add tests for navigation, chat discard, and refresh behavior.
    - Test edge cases (token expiry, incomplete onboarding, etc.).

---

**References:**
- [UKMLACaseBasedTutor7Cloud_FastAPI.py](https://github.com/talvinramnah/UKMLACaseTutorAPIVersion/blob/main/UKMLACaseBasedTutor7Cloud_FastAPI.py)
- Existing app flow and context in `ukmla-frontend` 