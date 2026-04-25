# Saily + TUNE Integration Notes

This project now supports two Saily affiliate modes:

1. **Direct partner params** (existing behavior)
   - Uses `SAILY_AFFILIATE_BASE_URL`, `SAILY_AFFILIATE_PARTNER_ID`, `SAILY_AFFILIATE_CAMPAIGN_ID`.
2. **TUNE click tracking** (new)
   - Set `SAILY_TUNE_CLICK_URL` to your full TUNE click URL.
   - The app adds:
     - `aff_sub` = plan id
     - `aff_sub2` = destination slug
     - `aff_sub3` = coupon (if any)
     - plus UTM params used by existing widgets/cards

## Required env vars

For TUNE API requests (server-side helpers):

- `TUNE_NETWORK_ID`
- `TUNE_API_KEY`
- Optional: `TUNE_API_BASE_URL` (defaults to `https://{TUNE_NETWORK_ID}.api.hasoffers.com/Apiv3/json`)

For Saily clickout URLs:

- `SAILY_TUNE_CLICK_URL` (recommended when using TUNE tracking links)

## Server helper

`lib/partners/tune.ts` includes:

- `tuneAffiliateRequest(target, method, params)` for generic TUNE calls
- `getTuneOffers()` as an optional convenience wrapper around `Affiliate_Offer.findAll`

These helpers run server-side and should not be called from client components.
