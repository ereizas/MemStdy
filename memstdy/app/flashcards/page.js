import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/router'
export default function Flashcard() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()
  
    
  }