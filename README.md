# Sudoku Solver & Game – React + TypeScript

## Project Overview

This project is a web-based **Sudoku game and solver**, built using **React** and **TypeScript** as part of a two-week development challenge. The application enables users to manually play Sudoku, generate new puzzles of varying difficulty, solve incomplete boards, and even extract Sudoku puzzles from uploaded images using **OCR (Optical Character Recognition)**.

The goal was to demonstrate frontend engineering skills, problem-solving with algorithms, and creative integration of image processing tools.

---

## Core Features

- Editable 9x9 Sudoku grid
- Real-time conflict detection and highlighting
- “Check Solution” button for manual validation
- Random puzzle generator with difficulty levels (easy, medium, hard)
- Backtracking-based automatic solver
- Hint system that reveals a single correct number
- OCR-based recognition from uploaded images
- Cell-by-cell OCR result feedback
- User guidance for unclear or low-quality images

---

## 🧠 Development Approach

The application was built progressively, starting from the UI and expanding into logic and advanced functionality:

1. **UI Construction**  
   A clean and responsive 9x9 grid was built with editable cells using controlled React inputs.

2. **Validation Logic**  
   Sudoku rules were enforced in real time by checking for duplicate values in rows, columns, and subgrids.

3. **Puzzle Generation**  
   A recursive backtracking algorithm was used to generate fully solved boards, followed by strategic cell removal to match the selected difficulty.

4. **Manual Solver & Hints**  
   A solver using the same backtracking method was added to fill incomplete user-input boards. A hint feature reveals a single correct value using the solver’s logic.

5. **Image-Based Solver (OCR)**  
   Integrated Tesseract.js to read Sudoku puzzles from uploaded images. A custom preprocessing pipeline extracts each cell with padding and contrast adjustments, then runs OCR per cell with retry logic for low-confidence reads.

6. **Component Separation**  
   Logic (solving, OCR, validation) was split from UI components for maintainability and testing.

---

## ⚔️ Key Challenges & Solutions

| Challenge | Solution |
|----------|----------|
| Low OCR accuracy on bold/stylized fonts | Applied per-cell grayscale conversion, contrast enhancement, and fallback retries |
| Missed digits (e.g. 8, 4) in OCR | Added padding around cell crops and relaxed confidence threshold |
| False positives in solving logic | Implemented Sudoku rule validation before solving |
| Ensuring uniqueness in generated puzzles | Controlled cell removal after solving using heuristic checks |
| Handling poor image quality | Provided user feedback and fallback mechanisms for image preprocessing |

---

## 🔧 Technical Highlights

- **Frontend Framework:** React (with functional components and hooks)  
- **Language:** TypeScript  
- **OCR Engine:** Tesseract.js  
- **Sudoku Logic:** Custom backtracking algorithms  
- **Image Handling:** Canvas-based cell segmentation and preprocessing  
- **Styling:** CSS Modules with responsive layout and intuitive design  
- **Data Model:** Grid as a 2D array of Cell objects, tracking value, fixed status, and conflicts

---

## ▶️ Usage Instructions

1. Navigate to the **Play** page:
   - Generate a new puzzle using the difficulty selector.
   - Use **Check** to validate, **Hint** for help, and **Reset** to generate new game based on the difficulty.

2. Navigate to the **Solver** page:
   - Input a custom puzzle or upload an image of a Sudoku board.
   - The app will extract digits, display the board, and optionally solve it.

---

## 📁 Summary

This project delivers a complete Sudoku application that combines algorithmic problem-solving with a clean user experience and OCR integration. It showcases modular, maintainable frontend design and extends beyond gameplay into intelligent recognition and automation.
