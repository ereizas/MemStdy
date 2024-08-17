import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',
});

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
};

export async function POST(req) {
  try {
    const { plan, userId } = await req.json();
    if (!plan) {
      throw new Error('Plan is required');
    }

    let unitAmount;
    switch (plan) {
      case 'Pro':
        unitAmount = 10;
        break;
      case 'Basic':
        unitAmount = 5;
        break;
      default:
        throw new Error('Invalid plan');
    }

    const params = {
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan} subscription`,
            },
            unit_amount: formatAmountForStripe(unitAmount),
            recurring: {
              interval: 'month',
              interval_count: 1,
            },
          },
          quantity: 1,
        },
      ],
      success_url: `https://your-domain.com/success?session_id={CHECKOUT_SESSION_ID}`, // Replace with your success URL
      cancel_url: `https://your-domain.com/cancel?session_id={CHECKOUT_SESSION_ID}`, // Replace with your cancel URL
    };

    console.log('Creating Stripe checkout session with params:', params);

    const checkoutSession = await stripe.checkout.sessions.create(params);

    console.log('Checkout session created:', checkoutSession);

    return NextResponse.json(checkoutSession, {
      status: 200,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new NextResponse(JSON.stringify({ error: { message: error.message } }), {
      status: 500,
    });
  }
}

export async function GET(req) {
  const searchParams = req.nextUrl.searchParams;
  const session_id = searchParams.get('session_id');

  try {
    if (!session_id) {
      throw new Error('Session ID is required');
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

    return NextResponse.json(checkoutSession);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json({ error: { message: error.message } }, { status: 500 });
  }
}
