import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Container,
  Button,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material";
import { styled } from "@mui/system";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#64B5F6",
    },
    secondary: {
      main: "#FF8F00",
    },
  },
});

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  marginTop: theme.spacing(8),
}));

const WordListContainer = styled("div")(({ theme }) => ({
  overflowY: "auto",
  maxHeight: "150px",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  gap: theme.spacing(1),
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
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    generateRandomWord();
    setWordList([]);
    setScore(0);
    setTimeRemaining(60);
    setShowMessage(false);
  }, []);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else {
      setCurrentWord("");
      setShowMessage(true);
    }
  }, [timeRemaining]);

  const generateRandomWord = async () => {
    const apiUrl = "https://random-word-api.herokuapp.com/word?number=1";

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        setCurrentWord(data[0].toLowerCase());
      } else {
        console.error("Invalid response from the API");
        setCurrentWord(generateRandomWordFromList());
      }
    } catch (error) {
      console.error("Error fetching random word:", error.message);
      setCurrentWord(generateRandomWordFromList());
    }
  };

  const generateRandomWordFromList = () => {
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
    return words[randomIndex].toLowerCase();
  };

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
        generateRandomWord();
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleRestart = () => {
    generateRandomWord();
    setWordList([]);
    setScore(0);
    setTimeRemaining(60);
    setShowMessage(false);
    setInputValue("");
  };

  const handleCloseMessage = () => {
    setShowMessage(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <StyledContainer>
        <Typography variant='h4' color='primary' style={{ marginBottom: 20 }}>
          Typing Game
        </Typography>
        <Typography variant='body1' color='primary'>
          Score: {score}
        </Typography>
        <Typography variant='body1' color='primary'>
          Try to pass 20
        </Typography>
        <Typography
          variant='body1'
          color='primary'
          style={{ marginBottom: 20 }}>
          Time Remaining: {timeRemaining}s
        </Typography>

        <WordListContainer spacing={1} direction={"row"}>
          {wordList.map((item, index) => (
            <Alert key={index} severity={item.isCorrect ? "success" : "error"}>
              {item.word}
            </Alert>
          ))}
        </WordListContainer>
        <Button
          variant='contained'
          style={{ color: "contained", fontSize: 20 }}>
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
          color='secondary'
          onClick={handleRestart}>
          Restart
        </StyledButton>

        <Collapse in={showMessage} timeout={1000} onExited={handleCloseMessage}>
          <Alert
            severity={score > 20 ? "success" : "error"}
            style={{ marginTop: 20 }}>
            {score > 20
              ? "Congratulations, you passed 20!"
              : "Shame on you! You could not pass 20!"}
          </Alert>
        </Collapse>
      </StyledContainer>
    </ThemeProvider>
  );
};

export default TypingGame;
