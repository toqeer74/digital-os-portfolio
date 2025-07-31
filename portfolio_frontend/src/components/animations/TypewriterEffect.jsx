import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterEffect = ({ words, speed = 100, delay = 1000, loop = true }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const handleTyping = () => {
      const currentWord = words[currentWordIndex];
      if (isDeleting) {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
        if (currentText.length === 0) {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
        if (currentText.length === currentWord.length) {
          setIsDeleting(true);
          if (!loop && currentWordIndex === words.length - 1) {
            return; // Stop if not looping and last word is typed
          }
          timer = setTimeout(() => setIsDeleting(true), delay);
        }
      }
    };

    const typingSpeed = isDeleting ? speed / 2 : speed;
    timer = setTimeout(handleTyping, typingSpeed);

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex, words, speed, delay, loop]);

  return (
    <div className="inline-block">
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="font-mono"
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ repeat: Infinity, duration: 0.8 }}
        className="inline-block w-2 h-6 bg-cyan-400 ml-1 align-middle"
      />
    </div>
  );
};

export default TypewriterEffect;


