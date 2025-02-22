import React, { useState, useRef, useEffect } from 'react';
import { Canvas, Image, Rect } from 'fabric';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Container = styled.div`
  padding: 2rem;
  text-align: center;
`;

const UploadButton = styled(motion.button)`
  background: linear-gradient(90deg, #00FF88, #00D1FF);
  border: none;
  color: #0A0A0A;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 2rem;
  &:hover {
    opacity: 0.9;
  }
`;

const CanvasContainer = styled.div`
  margin: 0 auto;
  max-width: 90%;
  border: 2px solid #00FF88;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
`;

const SaveButton = styled(motion.button)`
  background: #00FF88;
  border: none;
  color: #0A0A0A;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 700;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 1rem;
  margin-left: 1rem;
  &:hover {
    opacity: 0.9;
  }
`;

const AnnotationList = styled.ol`
  margin-top: 2rem;
  text-align: left;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
`;

const AnnotationItem = styled.li`
  margin-bottom: 1rem;
`;

const DescriptionInput = styled.input`
  margin-left: 1rem;
  padding: 0.5rem;
  border: 1px solid #00FF88;
  border-radius: 5px;
  background: transparent;
  color: #FFFFFF;
`;

interface Annotation {
  id: number;
  type: string;
  left: number;
  top: number;
  width: number;
  height: number;
  description: string;
}

interface ImageAnnotationToolProps {
  onSaveAnnotations: (annotations: Annotation[]) => void;
}

const ImageAnnotationTool: React.FC<ImageAnnotationToolProps> = ({ onSaveAnnotations }) => {
  const [image, setImage] = useState<string | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [nextId, setNextId] = useState(1); // Unique ID for each annotation
  const canvasRef = useRef<Canvas | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const annotationFileInputRef = useRef<HTMLInputElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);

  // Load default image on component mount
  useEffect(() => {
    const defaultImageUrl = '/Figure_02_Web.png'; // Path to the default image in the public folder
    setImage(defaultImageUrl);
  }, []);

  // Initialize Fabric.js canvas
  useEffect(() => {
    if (image && canvasContainerRef.current) {
      const canvas = new Canvas('annotation-canvas', {
        selection: false, // Disable selection of objects
      });
      canvasRef.current = canvas;

      // Load the image onto the canvas
      Image.fromURL(
        image,
        { crossOrigin: 'anonymous' } // Options object
      )
        .then((img) => {
          // Calculate the aspect ratio of the image
          const aspectRatio = img.width! / img.height!;

          // Set canvas size based on the image aspect ratio and container size
          const container = canvasContainerRef.current;
          if (container) {
            const maxWidth = container.clientWidth;
            const maxHeight = window.innerHeight * 0.8; // Limit height to 80% of viewport

            let canvasWidth = maxWidth;
            let canvasHeight = canvasWidth / aspectRatio;

            if (canvasHeight > maxHeight) {
              canvasHeight = maxHeight;
              canvasWidth = canvasHeight * aspectRatio;
            }

            canvas.setWidth(canvasWidth);
            canvas.setHeight(canvasHeight);

            // Scale the image to fit the canvas
            img.scaleToWidth(canvasWidth);
            canvas.backgroundImage = img;
            canvas.renderAll();
          }
        })
        .catch((error) => {
          console.error('Error loading image:', error);
        });

      // Add event listener for drawing rectangles (bounding boxes)
      const handleMouseDown = (event: any) => {
        const pointer = canvas.getPointer(event.e);
        const rect = new Rect({
          left: pointer.x,
          top: pointer.y,
          width: 50,
          height: 50,
          fill: 'transparent',
          stroke: 'red',
          strokeWidth: 2,
        });
        canvas.add(rect);

        // Add annotation with a unique ID and empty description
        const newAnnotation: Annotation = {
          id: nextId,
          type: 'rect',
          left: pointer.x,
          top: pointer.y,
          width: 50,
          height: 50,
          description: '',
        };
        setAnnotations((prev) => [...prev, newAnnotation]);
        setNextId((prev) => prev + 1); // Increment ID for the next annotation
      };

      canvas.on('mouse:down', handleMouseDown);

      // Handle window resize
      const handleResize = () => {
        if (canvasRef.current && canvasContainerRef.current) {
          const canvas = canvasRef.current;
          const img = canvas.backgroundImage as Image;

          if (img) {
            const aspectRatio = img.width! / img.height!;
            const container = canvasContainerRef.current;
            const maxWidth = container.clientWidth;
            const maxHeight = window.innerHeight * 0.8;

            let canvasWidth = maxWidth;
            let canvasHeight = canvasWidth / aspectRatio;

            if (canvasHeight > maxHeight) {
              canvasHeight = maxHeight;
              canvasWidth = canvasHeight * aspectRatio;
            }

            canvas.setWidth(canvasWidth);
            canvas.setHeight(canvasHeight);
            img.scaleToWidth(canvasWidth);
            canvas.renderAll();
          }
        }
      };

      window.addEventListener('resize', handleResize);

      // Cleanup on component unmount
      return () => {
        window.removeEventListener('resize', handleResize);
        canvas.off('mouse:down', handleMouseDown); // Remove event listener
        canvas.dispose();
      };
    }
  }, [image, nextId]);

  // Re-render annotations when the annotations state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Clear existing rectangles
      canvas.getObjects().forEach((obj) => {
        if (obj instanceof Rect) {
          canvas.remove(obj);
        }
      });

      // Re-render annotations
      annotations.forEach((annotation) => {
        const rect = new Rect({
          left: annotation.left,
          top: annotation.top,
          width: annotation.width,
          height: annotation.height,
          fill: 'transparent',
          stroke: 'red',
          strokeWidth: 2,
        });
        canvas.add(rect);
      });

      canvas.renderAll();
    }
  }, [annotations]);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Save annotations to a file
  const handleSaveAnnotations = () => {
    if (annotations.length > 0) {
      const annotationData = annotations.map((annotation) => ({
        id: annotation.id,
        type: annotation.type,
        left: annotation.left,
        top: annotation.top,
        width: annotation.width,
        height: annotation.height,
        description: annotation.description,
      }));

      // Convert annotations to JSON
      const json = JSON.stringify(annotationData, null, 2);

      // Create a Blob and download the file
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'annotations.json';
      a.click();
      URL.revokeObjectURL(url);

      onSaveAnnotations(annotationData);
    }
  };

  // Load annotations from a file
  const handleLoadAnnotations = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const content = event.target?.result as string;
          const loadedAnnotations = JSON.parse(content);

          // Update annotations state
          setAnnotations(loadedAnnotations);
          setNextId(loadedAnnotations.length + 1); // Set next ID based on loaded annotations
          alert('Annotations loaded successfully!');
        } catch (error) {
          console.error('Error parsing annotations file:', error);
          alert('Invalid annotations file.');
        }
      };
      reader.readAsText(file);
    }
  };

  // Update annotation description
  const handleDescriptionChange = (id: number, description: string) => {
    setAnnotations((prev) =>
      prev.map((annotation) =>
        annotation.id === id ? { ...annotation, description } : annotation
      )
    );
  };

  return (
    <Container>
      <UploadButton
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Upload Image
      </UploadButton>
      <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        accept=".json"
        onChange={handleLoadAnnotations}
        ref={annotationFileInputRef}
        style={{ display: 'none' }}
      />
      <SaveButton
        onClick={handleSaveAnnotations}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Save Annotations
      </SaveButton>
      <button
        onClick={() => annotationFileInputRef.current?.click()}
        style={{
          background: '#00D1FF',
          border: 'none',
          color: '#0A0A0A',
          padding: '0.75rem 1.5rem',
          fontSize: '1rem',
          fontWeight: 700,
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '1rem',
          marginLeft: '1rem',
        }}
      >
        Load Annotations
      </button>
      {image && (
        <>
          <CanvasContainer ref={canvasContainerRef}>
            <canvas id="annotation-canvas" />
          </CanvasContainer>
          <AnnotationList>
            {annotations.map((annotation) => (
              <AnnotationItem key={annotation.id}>
                <strong>Annotation {annotation.id}:</strong>
                <DescriptionInput
                  type="text"
                  placeholder="Enter description"
                  value={annotation.description}
                  onChange={(e) =>
                    handleDescriptionChange(annotation.id, e.target.value)
                  }
                />
              </AnnotationItem>
            ))}
          </AnnotationList>
        </>
      )}
    </Container>
  );
};

export default ImageAnnotationTool;