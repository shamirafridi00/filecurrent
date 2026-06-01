export const PLANS = {
  monthly: {
    variantId: process.env.LEMONSQUEEZY_MONTHLY_VARIANT_ID!,
    price: 9,
    label: 'Pro Monthly',
    interval: 'month' as const,
  },
  annual: {
    variantId: process.env.LEMONSQUEEZY_ANNUAL_VARIANT_ID!,
    price: 79,
    label: 'Pro Annual',
    interval: 'year' as const,
  },
  lifetime: {
    variantId: process.env.LEMONSQUEEZY_LIFETIME_VARIANT_ID!,
    price: 49,
    label: 'Lifetime',
    interval: null,
  },
} as const

export type PlanKey = keyof typeof PLANS

export async function createCheckoutUrl(
  planKey: PlanKey,
  userEmail: string,
  userId: string
): Promise<string> {
  const plan = PLANS[planKey]

  const payload = {
    data: {
      type: 'checkouts',
      attributes: {
        product_options: {
          redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=1`,
          receipt_button_text: 'Go to FileCurrent',
        },
        checkout_options: { embed: false },
        checkout_data: {
          email: userEmail,
          custom: { user_id: userId },
        },
        expires_at: null,
      },
      relationships: {
        store: {
          data: { type: 'stores', id: process.env.LEMONSQUEEZY_STORE_ID },
        },
        variant: {
          data: { type: 'variants', id: plan.variantId },
        },
      },
    },
  }

  const res = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
    method: 'POST',
    headers: {
      Accept: 'application/vnd.api+json',
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Lemon Squeezy checkout failed: ${err}`)
  }

  const data = await res.json() as { data: { attributes: { url: string } } }
  return data.data.attributes.url
}
