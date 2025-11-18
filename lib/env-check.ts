export function checkAuthEnv() {
  const requiredEnvVars = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    MONGODB_URI: process.env.MONGODB_URI,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    APPLE_ID: process.env.APPLE_ID,
    APPLE_SECRET: process.env.APPLE_SECRET,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  }

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key)

  if (missingVars.length > 0) {
    console.error("Missing environment variables:", missingVars)
    console.error("Please create a .env.local file with the following variables:")
    console.error("NEXTAUTH_URL=http://localhost:3000 (or your production URL)")
    console.error("NEXTAUTH_SECRET=your_nextauth_secret")
    console.error("MONGODB_URI=your_mongodb_connection_string")
    console.error("STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key")
    console.error("STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key")
    console.error("STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret")
    return false
  }

  // Validate NEXTAUTH_URL format
  const nextAuthUrl = process.env.NEXTAUTH_URL
  if (nextAuthUrl) {
    try {
      new URL(nextAuthUrl)
    } catch {
      console.error("Invalid NEXTAUTH_URL format. Please ensure it's a valid URL (e.g., http://localhost:3000)")
      return false
    }
  }

  console.log("All required environment variables are set")
  return true
}
