# QuizMaster Setup Guide

## 📋 Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Modern web browser

## 🚀 Installation Steps

1. **Navigate to project directory**
   ```bash
   cd QuizMaster
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Visit `http://localhost:5173`

## 🏗️ Build for Production

```bash
# Build the project
npm run build

# Preview the build
npm run preview
```

## 📦 Deployment Options

### Option 1: Netlify (Recommended)
1. Build: `npm run build`
2. Deploy folder: `dist`
3. The `_redirects` file is already configured

### Option 2: Vercel
1. Connect your GitHub repository
2. Vercel will auto-detect Vite configuration
3. The `vercel.json` file is already configured

### Option 3: GitHub Pages
1. Install gh-pages: `npm install --save-dev gh-pages`
2. Add to package.json scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
3. Run: `npm run deploy`

## 🎯 Features to Test

### Core Functionality
- [ ] Home page loads correctly
- [ ] Quiz selection works
- [ ] Questions display properly
- [ ] Timer functions correctly
- [ ] Navigation between questions
- [ ] Score calculation
- [ ] Results page shows detailed breakdown
- [ ] High scores are saved
- [ ] Responsive design on mobile

### Advanced Features
- [ ] GSAP animations are smooth
- [ ] Local storage persistence
- [ ] Error handling for API failures
- [ ] Keyboard navigation
- [ ] Exit quiz confirmation

## 🔧 Troubleshooting

### Common Issues

1. **Dependencies not installing**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port already in use**
   ```bash
   npm run dev -- --port 3001
   ```

3. **Build errors**
   - Check all imports are correct
   - Ensure all files are saved
   - Verify React version compatibility

### Performance Tips
- Enable React DevTools for debugging
- Use browser dev tools to check console errors
- Monitor network tab for API calls
- Check lighthouse scores for optimization

## 🎨 Customization

### Theme Colors
Edit `tailwind.config.js` to change the color scheme:
```javascript
colors: {
  primary: {
    // Your custom primary colors
    500: '#your-color',
  }
}
```

### Quiz Content
Add more questions to `src/data/questions.json`:
```json
{
  "id": 11,
  "category": "Your Category",
  "difficulty": "medium",
  "question": "Your question?",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": 0,
  "explanation": "Explanation text"
}
```

### Animation Speed
Modify animation durations in `src/utils/animations.js`

## 📱 Mobile Optimization
- All components are responsive by default
- Touch-friendly button sizes
- Optimized font sizes for mobile
- Proper viewport configuration

## 🔒 Security Features
- Input sanitization
- No external script injections
- HTTPS ready
- Content Security Policy headers (in Vercel config)

## 📊 Analytics (Optional)
To add Google Analytics, insert tracking code in `index.html`:
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🤝 Contributing
1. Follow the existing code structure
2. Add comments for complex functions
3. Test on multiple devices/browsers
4. Maintain accessibility standards
5. Keep animations performant

## 📞 Support
If you encounter issues:
1. Check browser console for errors
2. Verify all dependencies are installed
3. Ensure you're using Node.js v18+
4. Clear browser cache and localStorage

---

**Happy Quiz Building!** 🎯✨

Your QuizMaster app is ready to challenge minds and expand knowledge!
