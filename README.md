# Instructions

To install backend or frontend dependencies, navigate to either the `backend` or `frontend` folder in Terminal and follow the corresponding instructions of either the `backend` or `frontend` README.md.

# Optimizations

Some optimizations which could be added to this project.

1. Prevent stale requests - determine when the google access token will expire to automatically log out user.
2. Enforcing rate limitting on the backend client.

# Comments

Rationale behind using Firebase.

1. Client library exposes a simple API
2. Can manage which users have access via the Firebase Dashboard (Firebase Console)
3. Can support additional services to authenticate with: Email/password, Facebook, Twitter
