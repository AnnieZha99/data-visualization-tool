// src/App.tsx
import React from 'react';
import { GlobalStyles } from './styles/GlobalStyles';
import ImageAnnotationTool from './components/ImageAnnotationTool';

const App: React.FC = () => {
  return (
    <>
      <GlobalStyles />
      <h1 style={{ textAlign: 'center', margin: '2rem 0', color: '#00FF88' }}>
        Image Data Annotation Tool
      </h1>
      <ImageAnnotationTool onSaveAnnotations={(annotations) => console.log(annotations)} />
    </>
  );
};

export default App;