// File: app/page.js

'use client';

import { Container, AppBar, Toolbar, Typography, Button, Box, Grid } from '@mui/material';
import Head from 'next/head';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import getStripe from '@/utils/get_stripe';

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan) => {
    setLoading(true);

    try {
      const response = await fetch('/api/checkout_sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const { id } = await response.json();
      const stripe = await getStripe();

      const { error } = await stripe.redirectToCheckout({ sessionId: id });

      if (error) {
        console.warn('Stripe Checkout error:', error.message);
      }
    } catch (error) {
      console.error('Error during checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Head>
        <title>MemStdy Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from text prompts" />
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>MemStdy Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button color="inherit" href="/sign-up">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" gutterBottom>Welcome to MemStdy</Typography>
        <Typography variant="h5" gutterBottom>The easiest way to make flashcards from your text.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/generate">
          Get Started
        </Button>
      </Box>
      <Box sx={{ my: 6 }}>
        <Typography variant="h4" gutterBottom>Features</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart Flashcard Generation</Typography>
            <Typography>
              Our AI intelligently breaks down your text into flashcards, perfect for studying.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Accessible Anywhere</Typography>
            <Typography>
              Access your flashcards from any device and at any time. Study whenever you need.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{ my: 6, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5">Free</Typography>
              <Typography>Access to AI flashcard generation and storage for up to 20 sets</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCheckout('Free')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Get Started'}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography>Can store up to 50 sets</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCheckout('Basic')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Choose Basic'}
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={{ p: 3, border: '1px solid', borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10 / month</Typography>
              <Typography>Unlimited flashcards and storage, with priority support.</Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleCheckout('Pro')}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Choose Pro'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
