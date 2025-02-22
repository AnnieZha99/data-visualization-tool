// src/styles/GlobalStyles.ts
import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', sans-serif;
    background-color: #0A0A0A;
    color: #FFFFFF;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    color: #FFFFFF;
  }

  a {
    color: #00FF88;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;