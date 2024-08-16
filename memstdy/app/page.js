import Image from "next/image";
import getStripe from "@/utils/get_stripe"
import { 
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
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
        <Typography variant="h2">Welcome to MemStdy</Typography>
        <Typography variant="h5">The easiest way to make flashcards from your text.</Typography>
        <Button variant="contained" color="primary" sx={{mt:2}}>
          Get Started
          </Button>
      </Box>
    </Container>
  )
}