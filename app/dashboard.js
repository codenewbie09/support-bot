'use client';

import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

export default function Dashboard() {
  const [isBotRunning, setIsBotRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startBot = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/start-bot', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error(`Failed to start the bot: ${response.statusText}`);
      }

      setIsBotRunning(true);
    } catch (error) {
      setError('Failed to start the bot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f4f7fc"
      p={2}
    >
      <Box
        width="100%"
        maxWidth="400px"
        p={3}
        borderRadius="16px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        bgcolor="white"
        textAlign="center"
      >
        <Typography variant="h5" mb={2}>
          Welcome to the AI Support Dashboard
        </Typography>
        <Typography variant="body1" mb={4}>
          {isBotRunning
            ? "The bot is currently running. You can start chatting anytime."
            : "Click the button below to start the AI Support Bot."}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={startBot}
          startIcon={isLoading ? <CircularProgress size={20} /> : <PlayArrowIcon />}
          disabled={isLoading || isBotRunning}
          sx={{
            backgroundColor: isBotRunning ? '#4caf50' : '#1e88e5',
            color: 'white',
            '&:hover': {
              backgroundColor: isBotRunning ? '#388e3c' : '#1565c0',
            },
            '&:disabled': {
              backgroundColor: '#cfd8dc',
              color: '#ffffff',
            },
          }}
        >
          {isLoading ? 'Starting...' : isBotRunning ? 'Bot Running' : 'Start Bot'}
        </Button>
      </Box>

      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError(null)} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
