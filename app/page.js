'use client';

import {
  Box,
  Button,
  Stack,
  TextField,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Customer Support Assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleRetry = () => {
    setError(null);
    sendMessage();
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
  
    const userMessage = message.trim();
    setMessage(''); // Clear the input field
  
    // Add the user's message to the state
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'user', content: userMessage },
      { role: 'assistant', content: '' },
    ]);
  
    setIsLoading(true);
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, { role: 'user', content: userMessage }],
        }),
      });
  
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
  
      const data = await response.json(); // Parse JSON response
  
      // Check if content is structured correctly
      const responseContent = data.content || '';
  
      // Update the latest assistant message
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages];
        if (updatedMessages.length > 0) {
          updatedMessages[updatedMessages.length - 1].content = responseContent;
        }
        return updatedMessages;
      });
    } catch (error) {
      console.error('Error:', error);
      let errorMessage = 'An unexpected error occurred. Please try again later.';
      if (error.message.includes('Network response was not ok')) {
        errorMessage = 'There was a problem with the network. Please check your connection and try again.';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'The server is currently unreachable. Please try again later.';
      }
      setError(errorMessage);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: errorMessage },
      ]);
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
      <Stack
        direction={'column'}
        width="100%"
        maxWidth="600px"
        height="100%"
        maxHeight="80vh"
        borderRadius="16px"
        boxShadow="0 4px 12px rgba(0, 0, 0, 0.1)"
        bgcolor="white"
        p={3}
        spacing={3}
      >
        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          sx={{
            scrollbarWidth: 'thin',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#b0bec5',
              borderRadius: '10px',
            },
          }}
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                msg.role === 'assistant' ? 'flex-start' : 'flex-end'
              }
            >
              <Box
                bgcolor={
                  msg.role === 'assistant' ? '#e3f2fd' : '#1e88e5'
                }
                color={msg.role === 'assistant' ? 'black' : 'white'}
                borderRadius={12}
                p={2}
                boxShadow="0 2px 6px rgba(0, 0, 0, 0.1)"
                maxWidth="80%"
              >
                {msg.content || '...'} {}
              </Box>
            </Box>
          ))}
          {isLoading && (
            <Box display="flex" justifyContent="flex-start">
              <CircularProgress size={24} />
            </Box>
          )}
          <div ref={messagesEndRef} />
        </Stack>
        <Stack direction={'row'} spacing={2}>
          <TextField
            placeholder="Type your message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            variant="outlined"
            size="small"
            disabled={isLoading}
          />
          <Button
            variant="contained"
            onClick={sendMessage}
            endIcon={isLoading ? <CircularProgress size={24} color="inherit" /> : <SendIcon />}
            disabled={isLoading || !message.trim()}
            sx={{
              backgroundColor: '#1e88e5',
              color: 'white',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Stack>
      </Stack>
      {error && (
        <Snackbar
          open={!!error}
          autoHideDuration={6000}
          onClose={() => setError(null)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          sx={{ marginBottom: 2 }}
        >
          <Alert
            onClose={() => setError(null)}
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={handleRetry}>
                RETRY
              </Button>
            }
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </Box>
  );
}
