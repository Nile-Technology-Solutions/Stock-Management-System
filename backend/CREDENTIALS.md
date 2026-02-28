# Default User Credentials

After running `npx prisma db seed`, the following users are created:

## Seeded Users

| Username   | Password    | Role       | Description            |
| ---------- | ----------- | ---------- | ---------------------- |
| superadmin | password123 | SuperAdmin | Full system access     |
| admin      | password123 | Admin      | Admin dashboard access |
| customer   | password123 | Customer   | Customer portal access |

## Login Instructions

1. Go to http://localhost:5173/login
2. Click on any demo account button to auto-fill credentials
3. Click "Sign In"

## Change Default Passwords

For production, you should:

1. Change these default passwords immediately
2. Use the "Change Password" feature in user settings
3. Or update the seed file and re-seed the database

## Re-seeding Database

If you need to reset the database:

```bash
cd backend
npx prisma migrate reset  # WARNING: Deletes all data
npx prisma db seed        # Re-creates default users
```
