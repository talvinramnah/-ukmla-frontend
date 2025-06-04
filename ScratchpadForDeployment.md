# Vercel Deployment Troubleshooting & Resolution Plan (Planner Mode)

---

## Background and Motivation

You have a Next.js app that works locally, but after deploying to Vercel:
1. **Images are not loading** (400 errors from Next.js image optimization route).
2. **Login fails with CORS errors** (API on Render.com, frontend on Vercel).

The goal is to resolve these issues so the app works on Vercel as it does locally.

---

## Key Challenges and Analysis

### 1. Image Loading Issues
- **Symptom:** Images (e.g., from imgur.com) fail to load via Next.js's `/next/image` route with 400 errors.
- **Likely Causes:**
  - The image domain is not whitelisted in `next.config.js` under `images.domains`.
  - The image URL is not valid or accessible from the Vercel environment.
  - The image optimization loader is misconfigured.

### 2. CORS/API Fetch Issues
- **Symptom:** Login API call to Render.com fails with CORS error:  
  `No 'Access-Control-Allow-Origin' header is present on the requested resource.`
- **Likely Causes:**
  - The backend API does not allow requests from your Vercel frontend domain.
  - The CORS policy on the backend is too restrictive or missing.
  - Preflight (OPTIONS) requests are not handled correctly by the backend.

---

## High-level Task Breakdown

### 1. Fix Image Loading on Vercel
- [ ] **1.1** Check and update `next.config.js` to include all external image domains (e.g., `imgur.com`).
  - **Success:** Images from external sources load without 400 errors.
- [ ] **1.2** Test image URLs directly in the browser to ensure they are valid and accessible.
  - **Success:** URLs return images in browser.
- [ ] **1.3** If using custom image loader, verify configuration or revert to default.
  - **Success:** No custom loader errors.

### 2. Fix CORS/API Fetch Issues
- [ ] **2.1** Update backend CORS policy to allow requests from your Vercel deployment domain (e.g., `https://ukmla-frontend-878aksx2x-talvinramnahs-projects.vercel.app`).
  - **Success:** Preflight and login requests succeed from Vercel.
- [ ] **2.2** Ensure backend handles OPTIONS requests and sets correct CORS headers.
  - **Success:** No CORS errors in browser console.
- [ ] **2.3** (Optional) For local testing, use a proxy or mock server to simulate CORS.
  - **Success:** Local and deployed environments behave consistently.

### 3. Verification and Testing
- [ ] **3.1** Deploy fixes to a Vercel preview branch.
- [ ] **3.2** Test image loading and login flow on the deployed site.
- [ ] **3.3** Document any remaining issues or edge cases.

---

## Success Criteria

- All images load correctly on the Vercel deployment.
- Login and other API calls succeed without CORS errors.
- The app works on Vercel as it does locally.

---

## Project Status Board

- [ ] 1.1 Update `next.config.js` with all image domains
- [ ] 1.2 Test image URLs in browser
- [ ] 1.3 Verify/remove custom image loader if present
- [ ] 2.1 Update backend CORS policy for Vercel domain
- [ ] 2.2 Ensure backend handles OPTIONS and sets CORS headers
- [ ] 2.3 (Optional) Set up local proxy for CORS testing
- [ ] 3.1 Deploy fixes to Vercel preview
- [ ] 3.2 Test image loading and login on Vercel
- [ ] 3.3 Document/resolve any remaining issues

---

## Notes

- For CORS, you must update the backend (Render.com) to explicitly allow your Vercel frontend domain. This cannot be fixed from the frontend alone.
- For images, Next.js requires all external domains to be listed in `next.config.js` under `images.domains`.
- If you use environment variables for API URLs, double-check that Vercel is using the correct values.

---

