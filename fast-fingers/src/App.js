import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Container,
  Paper,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Chip,
} from "@mui/material";
import { styled } from "@mui/system";
// import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";

// Create a dark theme
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64B5F6", // Adjust the primary color as needed
    },
    secondary: {
      main: "#FF8F00", // Adjust the secondary color as needed
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(8),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(4),
  padding: theme.spacing(4),
}));

const StyledTextField = styled(TextField)({
  width: "300px",
  marginTop: "16px",
});

const StyledButton = styled(Button)({
  marginTop: "16px",
});

const TypingGame = () => {
  const [wordList, setWordList] = useState([]);
  const [currentWord, setCurrentWord] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(60);

  useEffect(() => {
    setCurrentWord(generateRandomWord());
    setWordList([]);
    setScore(0);
    setTimeRemaining(60);
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCurrentWord("");
    }
  }, [timeRemaining]);

  const handleKeyDown = (e) => {
    if (e.key === " ") {
      e.preventDefault();
      const isCorrect = inputValue.trim().toLowerCase() === currentWord;
      setWordList((prevWordList) => [
        ...prevWordList,
        { word: inputValue.trim(), isCorrect },
      ]);
      setInputValue("");

      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
        setCurrentWord(generateRandomWord());
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRestart = () => {
    setCurrentWord(generateRandomWord());
    setWordList([]);
    setScore(0);
    setTimeRemaining(60);
    setInputValue("");
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StyledContainer>
        <StyledPaper elevation={3}>
          <Typography variant='h4' color='primary'>
            Typing Game
          </Typography>
          <Typography variant='body1' color='primary'>
            Score: {score}
          </Typography>
          <Typography variant='body1' color='primary'>
            Time Remaining: {timeRemaining}s
          </Typography>
        </StyledPaper>
        <Stack spacing={1} direction={"row"}>
          {wordList.map((item, index) => (
            <Button
              key={index}
              // variant='outlined'x
              style={{
                color: item.isCorrect ? "success" : "error",
              }}>
              {item.word}
              {""}
            </Button>
          ))}
        </Stack>
        <Button variant='contained' style={{ color: "contained" }}>
          {currentWord}
        </Button>
        <StyledTextField
          label='Type here'
          variant='outlined'
          value={inputValue}
          onKeyDown={handleKeyDown}
          onChange={handleInputChange}
        />
        <StyledButton
          variant='contained'
          color='primary'
          onClick={handleRestart}>
          Restart
        </StyledButton>
      </StyledContainer>
    </ThemeProvider>
  );
};

const generateRandomWord = () => {
  const words = [
    "apple",
    "banana",
    "cherry",
    "orange",
    "grape",
    "kiwi",
    "melon",
    "pear",
    "peach",
    "plum",
  ];
  const randomIndex = Math.floor(Math.random() * words.length);
  return words[randomIndex];
};

export default TypingGame;
