# Environment Setup Guide

To enable features like "Continue with Google", you need to configure your environment variables.

1.  **Create or Edit `.env`**:
    In the root of your project, locate the `.env` file (create it if it doesn't exist).

2.  **Add Google Credentials**:
    Add the following lines to the file:

    ```env
    GOOGLE_CLIENT_ID="your-client-id-from-google-cloud"
    GOOGLE_CLIENT_SECRET="your-client-secret-from-google-cloud"
    ```

## How to get Google Credentials

1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project or select an existing one.
3.  Navigate to **APIs & Services** > **Credentials**.
4.  Click **Create Credentials** > **OAuth client ID**.
5.  Select **Web application**.
6.  Add `http://localhost:3000` to **Authorized JavaScript origins**.
7.  Add `http://localhost:3000/api/auth/callback/google` to **Authorized redirect URIs**.
8.  Copy the Client ID and Client Secret and paste them into your `.env` file.
