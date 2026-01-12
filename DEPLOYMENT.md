# Deployment Guide

## Prerequisites
- Vercel account (sign up at https://vercel.com)
- All environment variables configured
- Database seeded with initial data

---

## Environment Variables Required in Vercel Dashboard

Go to your Vercel project → Settings → Environment Variables and add:

### 🔵 Supabase (REQUIRED)
| Variable | Type | Value Source |
|----------|------|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Plain Text | Supabase Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Plain Text | Supabase Project Settings → API → anon public key |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Supabase Project Settings → API → service_role (secret!) |
| `DATABASE_URL` | **Secret** | Connection string from Supabase (transaction pooler) |

### 💳 Tap Payments (REQUIRED)
| Variable | Type | Value Source |
|----------|------|--------------|
| `TAP_SECRET_KEY` | **Secret** | Tap Dashboard → API Keys → Secret Key |
| `NEXT_PUBLIC_TAP_PUBLIC_KEY` | Plain Text | Tap Dashboard → API Keys → Publishable Key |

⚠️ **IMPORTANT:** Use test keys for staging, production keys for live site!

### 🔗 Affiliate Networks (Add After Approval)
| Variable | Type | Value Source |
|----------|------|--------------|
| `ARABCLICKS_PID` | Plain Text | ArabClicks Dashboard → Publisher ID |
| `AMAZON_ASSOCIATE_TAG` | Plain Text | Amazon Associates → Associate Tag |
| `NOON_OFFER_ID` | Plain Text | ArabClicks → Noon Campaign Offer ID |
| `FACES_OFFER_ID` | Plain Text | ArabClicks → Faces Campaign Offer ID |

### 📧 Email Service (REQUIRED for price alerts)
| Variable | Type | Value Source |
|----------|------|--------------|
| `RESEND_API_KEY` | **Secret** | Resend Dashboard → API Keys |

### 🔒 Security & Admin
| Variable | Type | Value Source |
|----------|------|--------------|
| `ADMIN_EMAIL` | Plain Text | Your admin email for dashboard access |
| `CRON_SECRET` | **Secret** | Generate random string (32+ chars) |

---

## Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
cd beauty-search-engine
vercel --prod
```

### Option 2: Deploy via GitHub Integration

1. Push your code to GitHub
2. Go to Vercel Dashboard → New Project
3. Import your GitHub repository
4. Configure environment variables (see above)
5. Deploy!

---

## Post-Deployment Checklist

### 1. Configure Tap.company Webhook
- Go to Tap Dashboard → Webhooks
- Add new webhook URL: `https://your-domain.vercel.app/api/subscription/webhook`
- Select event: `charge.captured`
- Save and test with a 0.100 KWD test transaction

### 2. Verify Cron Job Setup
- Go to Vercel Dashboard → Your Project → Crons
- Confirm cron job appears: `update-prices` scheduled for daily at midnight
- Manually trigger once to test: Settings → Crons → Trigger

### 3. Test Critical Flows
- [ ] User registration
- [ ] User login
- [ ] Product search
- [ ] Save product (free user - max 5)
- [ ] Subscribe (test payment)
- [ ] Webhook triggers (check Supabase user subscription status updates)
- [ ] Ingredient search (premium only)
- [ ] Price alert creation (premium only)

### 4. Monitor Logs
```bash
# View deployment logs
vercel logs your-deployment-url

# View function logs (webhooks, API routes)
vercel logs your-deployment-url --follow
```

### 5. Domain Configuration (Optional)
- Go to Vercel Dashboard → Your Project → Settings → Domains
- Add custom domain: `beautysearch.com` (example)
- Update DNS records as instructed by Vercel
- Update Tap webhook URL to use custom domain

---

## Troubleshooting

### Webhook Not Working
1. Check Vercel logs: `vercel logs --follow`
2. Verify `TAP_SECRET_KEY` is set correctly
3. Test webhook manually using Tap Dashboard's webhook tester
4. Ensure webhook URL returns 200 status

### Cron Job Not Running
1. Verify `CRON_SECRET` is set in Vercel
2. Check function logs in Vercel Dashboard
3. Manually trigger from Vercel Dashboard → Crons
4. Ensure cron path matches in vercel.json and route file

### Environment Variables Not Loading
1. Redeploy after adding new env vars
2. Check variable names match exactly (case-sensitive)
3. Verify secrets are not exposed in client-side code

### Database Connection Issues
1. Verify `DATABASE_URL` uses transaction pooler (port 6543)
2. Check Supabase project is not paused
3. Verify service role key has correct permissions

---

## Production Checklist

Before going live:
- [ ] Switch Tap keys from test to production
- [ ] Add all environment variables
- [ ] Test full payment flow with real card
- [ ] Configure webhook with production domain
- [ ] Seed database with real products (at least 200)
- [ ] Update affiliate URLs with real credentials
- [ ] Add Privacy Policy and Terms of Service pages
- [ ] Enable Vercel Analytics (optional)
- [ ] Set up error monitoring (Sentry, optional)
- [ ] Configure custom domain
- [ ] Test on mobile devices
- [ ] Run accessibility audit
- [ ] Perform security review

---

## Useful Commands

```bash
# Check deployment status
vercel ls

# View environment variables
vercel env ls

# Add environment variable
vercel env add VARIABLE_NAME

# Pull environment variables to local
vercel env pull

# Remove deployment
vercel rm deployment-url

# Check build logs
vercel logs deployment-url
```

---

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Tap Payments Docs: https://developers.tap.company
- Next.js Docs: https://nextjs.org/docs

---

**Need help?** Check the GitHub issues or contact the development team.
