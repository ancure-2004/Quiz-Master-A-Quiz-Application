import { gsap } from 'gsap';

/**
 * Animation utilities using GSAP
 */

// Timeline for managing complex animations
export const createTimeline = (options = {}) => {
  return gsap.timeline(options);
};

// Page transition animations
export const pageTransition = {
  enter: (element, direction = 'right') => {
    const x = direction === 'right' ? 100 : -100;
    gsap.fromTo(element, 
      { opacity: 0, x, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.5, ease: 'power2.out' }
    );
  },
  
  exit: (element, direction = 'left') => {
    const x = direction === 'left' ? -100 : 100;
    return gsap.to(element, {
      opacity: 0, x, scale: 0.9, duration: 0.3, ease: 'power2.in'
    });
  }
};

// Question animations
export const questionAnimations = {
  slideIn: (element) => {
    gsap.fromTo(element,
      { opacity: 0, y: 50, rotationX: -15 },
      { opacity: 1, y: 0, rotationX: 0, duration: 0.6, ease: 'back.out(1.7)' }
    );
  },
  
  slideOut: (element) => {
    return gsap.to(element, {
      opacity: 0, y: -30, scale: 0.95, duration: 0.4, ease: 'power2.in'
    });
  }
};

// Option button animations
export const optionAnimations = {
  staggerIn: (elements) => {
    gsap.fromTo(elements,
      { opacity: 0, y: 20, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.1, ease: 'back.out(1.7)' }
    );
  },
  
  select: (element) => {
    gsap.to(element, {
      scale: 1.05,
      duration: 0.2,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  },
  
  correct: (element) => {
    const tl = gsap.timeline();
    tl.to(element, {
      scale: 1.1,
      backgroundColor: '#10b981',
      color: '#ffffff',
      duration: 0.3,
      ease: 'back.out(1.7)'
    })
    .to(element, {
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    });
    return tl;
  },
  
  incorrect: (element) => {
    const tl = gsap.timeline();
    tl.to(element, {
      scale: 1.05,
      backgroundColor: '#ef4444',
      color: '#ffffff',
      duration: 0.2,
      ease: 'power2.out'
    })
    .to(element, {
      x: -10,
      duration: 0.1,
      ease: 'power2.out'
    })
    .to(element, {
      x: 10,
      duration: 0.1,
      ease: 'power2.out'
    })
    .to(element, {
      x: 0,
      scale: 1,
      duration: 0.2,
      ease: 'power2.out'
    });
    return tl;
  }
};

// Progress bar animations
export const progressAnimations = {
  update: (element, progress) => {
    gsap.to(element, {
      width: `${progress}%`,
      duration: 0.8,
      ease: 'power2.out'
    });
  },
  
  pulse: (element) => {
    gsap.to(element, {
      scale: 1.02,
      duration: 0.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  }
};

// Score animations
export const scoreAnimations = {
  countUp: (element, finalScore) => {
    const obj = { score: 0 };
    gsap.to(obj, {
      score: finalScore,
      duration: 2,
      ease: 'power2.out',
      onUpdate: () => {
        element.textContent = Math.round(obj.score);
      }
    });
  },
  
  celebrate: (element) => {
    const tl = gsap.timeline();
    tl.fromTo(element,
      { scale: 0, rotation: -180 },
      { scale: 1.2, rotation: 0, duration: 0.6, ease: 'back.out(1.7)' }
    )
    .to(element, {
      scale: 1,
      duration: 0.3,
      ease: 'power2.out'
    });
    return tl;
  }
};

// Timer animations
export const timerAnimations = {
  tick: (element) => {
    gsap.fromTo(element,
      { scale: 1.1 },
      { scale: 1, duration: 0.1, ease: 'power2.out' }
    );
  },
  
  warning: (element) => {
    gsap.to(element, {
      color: '#ef4444',
      scale: 1.1,
      duration: 0.5,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  },
  
  reset: (element) => {
    gsap.set(element, {
      color: '#374151',
      scale: 1
    });
  }
};

// Button animations
export const buttonAnimations = {
  hover: (element) => {
    gsap.to(element, {
      scale: 1.05,
      y: -2,
      duration: 0.2,
      ease: 'power2.out'
    });
  },
  
  leave: (element) => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      duration: 0.2,
      ease: 'power2.out'
    });
  },
  
  click: (element) => {
    gsap.to(element, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    });
  },
  
  pulse: (element) => {
    gsap.to(element, {
      boxShadow: '0 0 20px rgba(14, 165, 233, 0.6)',
      duration: 1,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: -1
    });
  }
};

// Loading animations
export const loadingAnimations = {
  spinner: (element) => {
    gsap.to(element, {
      rotation: 360,
      duration: 1,
      ease: 'none',
      repeat: -1
    });
  },
  
  dots: (elements) => {
    gsap.to(elements, {
      y: -10,
      duration: 0.6,
      ease: 'power2.inOut',
      stagger: 0.2,
      yoyo: true,
      repeat: -1
    });
  },
  
  skeleton: (element) => {
    gsap.fromTo(element,
      { opacity: 0.4 },
      { opacity: 1, duration: 1, ease: 'power2.inOut', yoyo: true, repeat: -1 }
    );
  }
};

// Card animations
export const cardAnimations = {
  flip: (element) => {
    const tl = gsap.timeline();
    tl.to(element, {
      rotationY: 90,
      duration: 0.3,
      ease: 'power2.in'
    })
    .to(element, {
      rotationY: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
    return tl;
  },
  
  bounce: (element) => {
    gsap.fromTo(element,
      { y: 0 },
      { y: -15, duration: 0.6, ease: 'power2.out', yoyo: true, repeat: 1 }
    );
  }
};

// Text animations
export const textAnimations = {
  typeWriter: (element, text) => {
    element.textContent = '';
    const chars = text.split('');
    chars.forEach((char, index) => {
      setTimeout(() => {
        element.textContent += char;
      }, index * 50);
    });
  },
  
  slideUp: (element) => {
    gsap.fromTo(element,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
  },
  
  fadeIn: (element, delay = 0) => {
    gsap.fromTo(element,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, delay, ease: 'power2.out' }
    );
  }
};

// Particle effects
export const particleEffects = {
  confetti: (container) => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];
    
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.style.cssText = `
        position: absolute;
        width: 10px;
        height: 10px;
        background: ${colors[Math.floor(Math.random() * colors.length)]};
        pointer-events: none;
        z-index: 1000;
      `;
      container.appendChild(particle);
      
      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 10,
        rotation: Math.random() * 360
      });
      
      gsap.to(particle, {
        y: -100,
        x: `+=${Math.random() * 200 - 100}`,
        rotation: `+=${Math.random() * 720 - 360}`,
        duration: Math.random() * 3 + 2,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });
    }
  }
};

// Master animation controller
export const animationController = {
  // Kill all animations
  killAll: () => {
    gsap.killTweensOf('*');
  },
  
  // Pause all animations
  pauseAll: () => {
    gsap.globalTimeline.pause();
  },
  
  // Resume all animations
  resumeAll: () => {
    gsap.globalTimeline.resume();
  },
  
  // Set global animation speed
  setGlobalSpeed: (speed = 1) => {
    gsap.globalTimeline.timeScale(speed);
  }
};

// Intersection Observer animation triggers
export const observerAnimations = {
  fadeInOnScroll: (elements) => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          gsap.fromTo(entry.target,
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
          );
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    elements.forEach(el => observer.observe(el));
  }
};

export default {
  createTimeline,
  pageTransition,
  questionAnimations,
  optionAnimations,
  progressAnimations,
  scoreAnimations,
  timerAnimations,
  buttonAnimations,
  loadingAnimations,
  cardAnimations,
  textAnimations,
  particleEffects,
  animationController,
  observerAnimations
};
