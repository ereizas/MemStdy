import Image from "next/image";
import getStripe from "@/utils/get_stripe"
import { 
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Grid
} from '@mui/material'
import Head from'next/head'
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function Home() {
  return (
    <Container maxWidth="lg">
      <Head>
        <title>MemStdy Flashcard SaaS</title>
        <meta name="description" content="Create flashcards from text prompts"></meta>
      </Head>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{flexGrow:1}}>MemStdy Flashcard SaaS</Typography>
          <SignedOut>
            <Button color="inherit">Log In</Button>
            <Button color="inherit">Sign Up</Button>
          </SignedOut>
          <SignedIn>
            <UserButton/>
          </SignedIn>
        </Toolbar>
      </AppBar>
      <Box
      sx={{textAlign:'center', my:4}}
      >
        <Typography variant="h2" gutterBottom>Welcome to MemStdy</Typography>
        <Typography variant="h5" gutterBottom>The easiest way to make flashcards from your text.</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}}>
          Get Started
          </Button>
      </Box>
      <Box sx = {{my:6}}>
        <Typography variant="h4" gutterBottom>
          Features
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>Smart Flashcard Generation</Typography>
            <Typography>
              {' '}
              Our AI intelligently breaks down your text into flashcards, perfect for studying.
            </Typography>
          </Grid>
        </Grid>
      </Box>
      <Box sx={{my:6, textAlign:"center"}}>
        <Typography variant="h4" gutterBottom>Pricing</Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{p:3,border: '1px solid', borderColor:'grey,300', borderRadius:2}}>
              <Typography variant="h5">Free</Typography>
              <Typography>
                {' '}
                Access to AI flashcard generation and storage for up to 20 sets
              </Typography>
              <Button variant="contained" color="primary">Get Started</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{p:3,border: '1px solid', borderColor:'grey,300', borderRadius:2}}>
              <Typography variant="h5" gutterBottom>Basic</Typography>
              <Typography variant="h6" gutterBottom>$5 / month</Typography>
              <Typography>
                {' '}
                Can store up to 50 sets
              </Typography>
              <Button variant="contained" color="primary">Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{p:3,border: '1px solid', borderColor:'grey,300', borderRadius:2}}>
              <Typography variant="h5" gutterBottom>Pro</Typography>
              <Typography variant="h6" gutterBottom>$10 / month</Typography>
              <Typography>
                {' '}
                Unlimited flashcards and storage, with priority support.
              </Typography>
              <Button variant="contained" color="primary">Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  )
}