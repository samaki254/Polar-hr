# Polar HR Consultancy – Workspace (React + Vite + Firebase)
Stack: React, Vite, Firebase Auth, Firestore, Storage, Hosting.
## Setup
1. Create a Firebase project under the Polar HR Google account; enable Authentication (Email/Password), Firestore, Storage.
2. Project settings > Your apps > Web app: copy the config values into `.env` (see `.env.example`).
3. `npm install` then `npm run dev`.
## First administrator
Console > Authentication > add a user. Copy their UID. In Firestore create `users/<UID>` with `{name, email, role:"admin", active:true}`. Sign in, then use **Seed workspace** to create the 10 boards and sample candidates.
## Add staff
Create the user in Authentication, then add `users/<UID>` with role: admin, manager, hr, training, finance, marketing or staff.
## Deploy
`npm run build`, `firebase login`, `firebase init` (use existing firebase.json, rules, dist), `firebase deploy`.
## Data model
`users/{uid}`; `boards/{id}` (name, groups[], columns[] with status options); `boards/{id}/items/{id}` (name, groupId, values{columnId:value}).
Finance board is restricted to admin, finance and manager in the Firestore rules.
## Not yet built
Subitems, updates thread UI, file upload UI (storage.rules ready), notifications, CSV import, reports, backup/restore, Cloud Functions, per-board role matrix.
