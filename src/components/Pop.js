import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Pop.css';

const MUSIC_SRC = '/birthday.mp3';
const useAudio = (url) => {
  const audioRef = useRef(new Audio(url));

  useEffect(() => {
    const audio = audioRef.current;
    audio.loop = true;
    audio.volume = 0.5;

    const startMusic = () => {
      audio.play().catch(() => console.warn("Audio blocked, tap anywhere to start music"));
    };

    document.addEventListener('click', startMusic, { once: true });
    document.addEventListener('touchstart', startMusic, { once: true });

    return () => audio.pause();
  }, [url]);
};


// const useAudio = (url) => {
//   const audioRef = useRef(new Audio(url));

//   useEffect(() => {
//     const audio = audioRef.current;
//     audio.loop = true;
//     audio.volume = 0.5;
//     const startMusic = () => {
//       audio.play().catch(() => {});
//       document.removeEventListener('click', startMusic);
//       document.removeEventListener('touchstart', startMusic);
//     };
//     document.addEventListener('click', startMusic);
//     document.addEventListener('touchstart', startMusic);
//     return () => audio.pause();
//   }, [url]);
// };

const Countdown = ({ onComplete }) => {
  const [count, setCount] = useState(3);
  useEffect(() => {
    if (count <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setCount(count - 1), 1000);
    return () => clearTimeout(timer);
  }, [count, onComplete]);

  return (
    <div className="countdown-overlay">
      <motion.div
        key={count}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="count-number"
      >
        {count}
      </motion.div>
    </div>
  );
};

const SlideIntro = ({ next }) => (
  <motion.div className="slide" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 className="text-glow">✨ A Wonderful Soul was Born today ✨</h1>
    <h3>Across the miles… something heartfelt is coming for you...</h3>
    <p>Relax, something funny (and definitely not edible) is coming.</p>
    <button className="surprise-button" onClick={next}>🎁 Start the Surprise</button>
  </motion.div>
);

const SlideCake = ({ next }) => {
  const [lit, setLit] = useState(false);
  return (
    <motion.div className="slide" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="cake">
        <div className="cake-base"></div>
        <div className="icing-drip"></div>
        <div className="top-layer"></div>
        <div className="candle" onClick={() => setLit(true)}>
          <div className={`flame ${lit ? 'lit' : ''}`}></div>
        </div>
      </div>
      <h1 className="text-glow">Make a wish 🎂</h1>
      {!lit && <p className="hint-text">Click the candle to light it!</p>}
      {lit && <button className="surprise-button" onClick={next}>🎈 Pop Balloons →</button>}
    </motion.div>
  );
};

const SlideBalloons = ({ next }) => {
  const balloons = ['H', 'B', 'D', '!'];
  const [popped, setPopped] = useState([]);
  const [message, setMessage] = useState('');

  const msgs = {
    H: "H is for Happy! The world is lucky to have you.",
    B: "B is for Bright! You’re a gift to everyone you meet.",
    D: "D is for Darling!  May your dreams take flight this year.",
    '!': "You're simply magic! ✨"
  };

  const handlePop = (b) => {
    if (!popped.includes(b)) {
      setPopped([...popped, b]);
      setMessage(msgs[b]);
    }
  };

  return (
    <motion.div className="slide" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-glow">Pop all the balloons 🎈</h2>
      <div className="balloon-area">
        {balloons.map((b, i) => (
          <motion.div
            key={i}
            className={`balloon balloon-${i} ${popped.includes(b) ? 'popped' : ''}`}
            onClick={() => handlePop(b)}
            whileHover={{ scale: popped.includes(b) ? 1 : 1.1 }}
          >
            {popped.includes(b) ? '💥' : b}
          </motion.div>
        ))}
      </div>
      {message && (
        <motion.div className="secret-message-balloon" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p>{message}</p>
          <button className="next-secret-button" onClick={() => {
            setMessage('');
            if (popped.length === 4) next();
          }}>
            {popped.length === 4 ? '💌 Final Message →' : 'Next →'}
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

const SlideMessage = () => (
  <motion.div className="slide" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
    <h1 className="text-glow">💖 A Msg from My Heart to My Anonymous 💖</h1>
    <div className="final-card-message">
      <p>To My Dearest,<br/>
        Your presence adds warmth to days that would otherwise feel ordinary.
May the year ahead wrap you in soft moments, new beginnings, and blessings that find you quietly.
Thank you for the joy, the laughs, and the comfort you bring without even trying 🌷<br/>
Once again!</p>
<h2>HAPPY BIRTHDAY!</h2>
      <p className="signature">– With love, always 💌</p>
    </div>
    <div className="confetti-wrapper">
  {Array.from({ length: 60 }).map((_, i) => {
    const left = Math.random() * 100; // %
    const size = 5 + Math.random() * 8; // px
    const delay = Math.random() * 3; // sec
    const color = `hsl(${Math.random() * 360}, 80%, 60%)`;
    return (
      <div
        key={i}
        className="confetti"
        style={{
          left: `${left}%`,
          width: `${size}px`,
          height: `${size * 2}px`,
          backgroundColor: color,
          animationDelay: `${delay}s`,
        }}
      />
    );
  })}
</div>

  </motion.div>
);

export default function Pop() {
  const [step, setStep] = useState(-1); // -1 means show countdown
  useAudio(MUSIC_SRC);

  return (
    <div className="surprise-container">
      <AnimatePresence>
        {step === -1 && <Countdown onComplete={() => setStep(0)} />}
        {step >= 0 && (
          <>
            {step === 0 && <SlideIntro next={() => setStep(1)} />}
            {step === 1 && <SlideCake next={() => setStep(2)} />}
            {step === 2 && <SlideBalloons next={() => setStep(3)} />}
            {step === 3 && <SlideMessage />}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
