'use client';
import { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import { db } from '../../firebase';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { useUser } from '@clerk/nextjs';

export default function Generate() {
  const { user } = useUser();
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);
  const [setName, setSetName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewSetsOpen, setViewSetsOpen] = useState(false);
  const [flashcardSets, setFlashcardSets] = useState([]);
  const [selectedSet, setSelectedSet] = useState(null);
  const [selectedFlashcards, setSelectedFlashcards] = useState([]);

  const handleOpenDialog = () => setDialogOpen(true);
  const handleCloseDialog = () => setDialogOpen(false);
  const handleOpenViewSets = () => setViewSetsOpen(true);
  const handleCloseViewSets = () => {
    setViewSetsOpen(false);
    setSelectedSet(null);
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      alert('Please enter some text to generate flashcards.');
      return;
    }

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        body: text,
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setFlashcards(data);
    } catch (error) {
      console.error('Error generating flashcards:', error);
      alert('An error occurred while generating flashcards. Please try again.');
    }
  };

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.');
      return;
    }

    try {
      const userId = user.id;
      const userDocRef = doc(db, 'users', userId);
      const setDocRef = doc(collection(userDocRef, 'flashcardSets'), setName);
      await setDoc(setDocRef, { flashcards });

      alert('Flashcards saved successfully!');
      handleCloseDialog();
      setSetName('');
    } catch (error) {
      console.error('Error saving flashcards:', error);
      alert('An error occurred while saving flashcards. Please try again.');
    }
  };

  const fetchFlashcardSets = async () => {
    if (user) {
      try {
        const userId = user.id;
        const userDocRef = doc(db, 'users', userId);
        const flashcardSetsRef = collection(userDocRef, 'flashcardSets');
        const querySnapshot = await getDocs(flashcardSetsRef);

        const sets = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFlashcardSets(sets);
      } catch (error) {
        console.error('Error fetching flashcard sets:', error);
        alert('An error occurred while fetching flashcard sets. Please try again.');
      }
    }
  };

  const handleSetClick = async (setId) => {
    try {
      const userId = user.id;
      const setDocRef = doc(db, 'users', userId, 'flashcardSets', setId);
      const setDoc = await getDoc(setDocRef);

      if (setDoc.exists()) {
        setSelectedFlashcards(setDoc.data().flashcards);
        setSelectedSet(setId);
      } else {
        alert('No flashcards found for this set.');
      }
    } catch (error) {
      console.error('Error fetching flashcards:', error);
      alert('An error occurred while fetching flashcards. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Generate Flashcards
        </Typography>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          label="Enter text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          fullWidth
        >
          Generate Flashcards
        </Button>
      </Box>
      {flashcards.length > 0 && (
        <>
          <Box sx={{ mt: 4 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Generated Flashcards
            </Typography>
            <Grid container spacing={2}>
              {flashcards.map((flashcard, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6">Front:</Typography>
                      <Typography>{flashcard.front}</Typography>
                      <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                      <Typography>{flashcard.back}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleOpenDialog}>
              Save Flashcards
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                fetchFlashcardSets();
                handleOpenViewSets();
              }}
              sx={{ ml: 2 }}
            >
              View All Flashcard Sets
            </Button>
          </Box>
        </>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Save Flashcard Set</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter a name for your flashcard set.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={saveFlashcards} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewSetsOpen} onClose={handleCloseViewSets}>
        <DialogTitle>View Flashcard Sets</DialogTitle>
        <DialogContent>
          {selectedSet ? (
            <Box>
              <Typography variant="h6" gutterBottom>
                Flashcards in "{selectedSet}" Set
              </Typography>
              <Grid container spacing={2}>
                {selectedFlashcards.map((flashcard, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6">Front:</Typography>
                        <Typography>{flashcard.front}</Typography>
                        <Typography variant="h6" sx={{ mt: 2 }}>Back:</Typography>
                        <Typography>{flashcard.back}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          ) : (
            <Box>
              <Typography variant="h6" gutterBottom>
                Available Flashcard Sets
              </Typography>
              <List>
                {flashcardSets.map((set) => (
                  <ListItem
                    button
                    key={set.id}
                    onClick={() => handleSetClick(set.id)}
                    sx={{
                      bgcolor: 'background.paper',
                      color: 'text.primary',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                      mb: 1,
                    }}
                  >
                    <ListItemText primary={set.name} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewSets}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
