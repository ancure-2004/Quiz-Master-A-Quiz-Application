# QuizMaster 🧠

An interactive, beautifully animated quiz application built with React, Vite, and GSAP. Challenge your knowledge across multiple categories with timed questions and track your progress!

## ✨ Features

- **Multiple Quiz Modes**: Quick Quiz, Standard Quiz, Expert Challenge, and Lightning Round
- **Timed Questions**: Race against the clock with customizable time limits
- **Beautiful Animations**: Smooth GSAP animations throughout the interface
- **Progress Tracking**: Local storage of high scores and statistics
- **Responsive Design**: Works perfectly on desktop and mobile devices
- **Multiple Difficulty Levels**: Easy, Medium, and Hard questions
- **Category Support**: Science, History, Sports, Geography, and more
- **Detailed Results**: Review your answers with explanations
- **High Score System**: Track your best performances
- **Accessibility**: Keyboard navigation and screen reader support

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd QuizMaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory, ready for deployment.

## 🏗️ Project Structure

```
QuizMaster/
├── public/
│   ├── favicon.svg
│   └── index.html
├── src/
│   ├── components/
│   │   ├── common.jsx      # Reusable UI components
│   │   ├── Question.jsx    # Quiz question component
│   │   └── Layout.jsx      # Main layout component
│   ├── pages/
│   │   ├── Home.jsx        # Landing page
│   │   ├── Quiz.jsx        # Quiz interface
│   │   └── Results.jsx     # Results and review page
│   ├── hooks/
│   │   ├── useQuiz.js      # Quiz state management
│   │   └── useLocalStorage.js # Local storage utilities
│   ├── utils/
│   │   ├── api.js          # API utilities and helpers
│   │   └── animations.js   # GSAP animation utilities
│   ├── data/
│   │   └── questions.json  # Local quiz questions
│   ├── App.jsx             # Main app component
│   ├── main.jsx           # React entry point
│   └── index.css          # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 How to Use

### Starting a Quiz
1. Choose from four quiz modes on the home page
2. Review the quiz settings (questions, time limit, difficulty)
3. Click "Start Quiz" to begin

### Taking the Quiz
- Read each question carefully
- Select your answer before time runs out
- Use navigation buttons to go back to previous questions
- Complete all questions to see your results

### Reviewing Results
- View your score and performance message
- Review detailed answers with explanations
- Check your high scores
- Restart the same quiz or try a new one

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional animation library

### Features
- **Custom Hooks** - Reusable state logic
- **Local Storage** - Persistent high scores and stats
- **Responsive Design** - Mobile-first approach
- **Error Boundaries** - Graceful error handling
- **Accessibility** - ARIA labels and keyboard navigation

## 🎨 Design System

### Colors
- **Primary**: Blue (#0EA5E9) - Main brand color
- **Secondary**: Purple (#D946EF) - Accent color
- **Success**: Green (#10B981) - Correct answers
- **Error**: Red (#EF4444) - Incorrect answers
- **Warning**: Orange (#F59E0B) - Medium difficulty

### Typography
- **Font Family**: Inter - Modern, readable typeface
- **Font Weights**: 300, 400, 500, 600, 700

### Animations
All animations are built with GSAP for smooth, performant motion:
- **Page Transitions**: Smooth entrance/exit animations
- **Question Flow**: Sliding questions with stagger effects
- **Button Interactions**: Hover and click feedback
- **Score Reveals**: Counting animations and celebrations
- **Loading States**: Elegant spinner and skeleton loaders

## 🔧 Configuration

### Quiz Settings
You can customize quiz behavior in the question data and components:

```javascript
// Default quiz options
const defaultOptions = {
  questionCount: 10,      // Number of questions
  timeLimit: 30,          // Seconds per question
  difficulty: 'mixed',    // easy, medium, hard, or mixed
  useAPI: false          // Use Open Trivia DB API
};
```

### API Integration
The app supports the Open Trivia Database API for dynamic questions:

```javascript
// Enable API mode
const quizOptions = {
  useAPI: true,
  category: 9,           // Optional: specific category
  difficulty: 'medium'   // Optional: specific difficulty
};
```

## 📊 Local Storage

The app stores user data locally:
- **High Scores**: Top 10 quiz results
- **User Stats**: Total quizzes, average score, streaks
- **Preferences**: Theme, sound settings, defaults

Data persists across browser sessions and is automatically managed.

## 🌐 Deployment

### Recommended Platforms
- **Netlify**: Connect your GitHub repo for automatic deployments
- **Vercel**: Zero-config deployment with preview URLs
- **GitHub Pages**: Free hosting for open source projects

### Environment Setup
1. Build the project: `npm run build`
2. Upload the `dist` directory to your hosting platform
3. Configure routing for single-page application (SPA)

### Example Netlify Deployment
1. Connect GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Enable SPA routing in site settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Add comments for complex logic
- Test on both desktop and mobile
- Ensure animations are performant
- Maintain accessibility standards

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing GitHub issues
2. Create a new issue with detailed information
3. Include browser version and error messages

## 🙏 Acknowledgments

- **Open Trivia Database** - Free API for quiz questions
- **Tailwind CSS** - Utility-first CSS framework
- **GSAP** - Professional animation library
- **React Team** - Amazing JavaScript library
- **Vite Team** - Lightning-fast build tool

---

**QuizMaster** - Challenge Your Knowledge, Expand Your Mind! 🧠✨

Made with ❤️ using React, Vite, and GSAP
