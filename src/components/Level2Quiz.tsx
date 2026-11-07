import React, { useEffect, useState } from 'react';
import { CharacterRole } from '../types';
import { sound } from '../utils/audio';
import { CHARACTERS, QUIZ_QUESTIONS } from '../utils/storage';
import { CharacterSprite, NIGHT_BG_URL } from './CharacterSprite';

interface Level2QuizProps {
  playerRole: CharacterRole;
  onAwardHearts: (amount: number) => void;
  onCompleteLevel: () => void;
}

export const Level2Quiz: React.FC<Level2QuizProps> = ({
  playerRole,
  onAwardHearts,
  onCompleteLevel,
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [quizFinished, setQuizFinished] = useState(false);

  // Character reaction speech bubbles
  const [billoBubble, setBilloBubble] = useState<string | null>(null);
  const [pilluBubble, setPilluBubble] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[currentIdx];
  const isSpeedRound = !!question?.isTimed;

  // Countdown timer for speed round
  useEffect(() => {
    if (!isSpeedRound || hasAnswered || quizFinished) return;

    setTimeLeft(15);
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAnswer(-1); // Time out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentIdx, isSpeedRound, hasAnswered, quizFinished]);

  const handleAnswer = (optionIdx: number) => {
    if (hasAnswered) return;
    setSelectedOption(optionIdx);
    setHasAnswered(true);

    const isCorrect = optionIdx === question.correctIndex;
    if (isCorrect) {
      sound.playHeartPickup();
      setScore((s) => s + 1);
      onAwardHearts(isSpeedRound ? 3 : 2); // Bonus hearts for quiz questions
      setBilloBubble('You remembered! 🥰');
      setPilluBubble("That's our story! 💖");
    } else {
      sound.playJump();
      setBilloBubble('Aww, close one! 😂');
      setPilluBubble('Still my favourite! 💕');
    }
  };

  const handleNextQuestion = () => {
    sound.playJump();
    setBilloBubble(null);
    setPilluBubble(null);

    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      sound.playVictory();
      setQuizFinished(true);
    }
  };

  return (
    <div
      className="relative w-full h-full p-3 sm:p-5 flex flex-col justify-between overflow-hidden select-none font-pixel animate-fade-in"
      style={{
        backgroundImage: `url(${NIGHT_BG_URL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-[#0e051c]/75 backdrop-blur-[1px] pointer-events-none" />

      {!quizFinished ? (
        <>
          {/* Top Question Row with Sprites */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <div className="flex items-end gap-3 sm:gap-4 pt-4">
              <CharacterSprite
                role="billo"
                size={58}
                animation={hasAnswered && selectedOption === question.correctIndex ? 'celebrate' : 'idle'}
                dialogueBubble={billoBubble}
                showHeart={hasAnswered && selectedOption === question.correctIndex}
                showNameTag={true}
              />
              <CharacterSprite
                role="pillu"
                size={58}
                animation={hasAnswered && selectedOption === question.correctIndex ? 'celebrate' : 'idle'}
                dialogueBubble={pilluBubble}
                showHeart={hasAnswered && selectedOption === question.correctIndex}
                showNameTag={true}
              />
            </div>

            {isSpeedRound && (
              <div className="px-2.5 py-1 bg-red-950/80 border-2 border-red-500 text-yellow-300 text-xs pixel-corners animate-pulse flex items-center gap-1.5">
                <span>⚡ SPEED ROUND:</span>
                <span className="font-bold text-sm">{timeLeft}s</span>
              </div>
            )}
          </div>

          {/* Question Text Box */}
          <div className="relative z-10 bg-[#1e0a2d]/90 p-3 sm:p-4 pixel-border border-pink-400 my-2 shadow-xl">
            <span className="text-[8px] sm:text-[9px] text-pink-400 uppercase tracking-widest block mb-0.5">
              Question {currentIdx + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <h3 className="font-retro text-xl sm:text-2xl md:text-3xl text-yellow-200 leading-snug">
              {question.question}
            </h3>
          </div>

          {/* Answer Options Grid (4 Options) */}
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
            {question.options.map((opt, optIdx) => {
              let btnStyle =
                'bg-[#280c3b]/85 border-pink-700/60 text-pink-100 hover:bg-[#3d135c] hover:border-pink-400 cursor-pointer';

              if (hasAnswered) {
                if (optIdx === question.correctIndex) {
                  btnStyle =
                    'bg-green-900/90 border-green-400 text-green-100 shadow-[0_0_12px_rgba(74,222,128,0.6)] animate-pulse';
                } else if (optIdx === selectedOption) {
                  btnStyle = 'bg-rose-950/90 border-rose-500 text-rose-200 opacity-80';
                } else {
                  btnStyle = 'bg-[#180625]/60 border-pink-900/40 text-pink-400/50';
                }
              }

              return (
                <button
                  key={optIdx}
                  disabled={hasAnswered}
                  onClick={() => handleAnswer(optIdx)}
                  className={`p-2.5 sm:p-3 text-left border-2 pixel-corners transition-all flex items-start gap-2.5 active:scale-95 ${btnStyle}`}
                >
                  <span className="text-yellow-300 text-xs font-bold shrink-0">
                    {['A', 'B', 'C', 'D'][optIdx]}.
                  </span>
                  <span className="font-retro text-lg sm:text-xl md:text-2xl leading-tight">
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Post-Answer Dialogue Feedback Strip */}
          {hasAnswered && (
            <div className="relative z-10 mt-2 bg-[#150524]/95 p-2.5 sm:p-3 pixel-border border-yellow-400 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xl animate-fade-in">
              <div className="flex-1 font-retro text-lg sm:text-xl text-pink-200">
                <p className="text-yellow-300 font-bold mb-0.5">
                  {selectedOption === question.correctIndex ? '💖 Correct! +2 Hearts Awarded!' : '💕 Close enough! We love each other anyway!'}
                </p>
                <p>{question.partnerReaction}</p>
              </div>
              <button
                onClick={handleNextQuestion}
                className="px-5 py-1.5 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-black font-bold text-[10px] sm:text-xs uppercase pixel-corners shadow-lg shrink-0 active:scale-95 cursor-pointer"
              >
                {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'Next Question →' : 'View Results! 🎉'}
              </button>
            </div>
          )}
        </>
      ) : (
        // Quiz Results & Level 2 Completion Modal
        <div className="relative z-10 flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-[#1a0a2c]/90 pixel-border border-yellow-400 my-auto shadow-2xl">
          <span className="text-4xl mb-1 animate-bounce">🎉</span>
          <h2 className="text-xs sm:text-sm text-yellow-300 font-bold uppercase tracking-wider mb-1">
            QUIZ COMPLETED!
          </h2>
          <p className="font-retro text-2xl sm:text-3xl text-pink-100 mb-1">
            You scored <span className="text-green-300 font-bold">{score} / {QUIZ_QUESTIONS.length}</span>!
          </p>
          <p className="font-retro text-xl sm:text-2xl text-pink-300 mb-4 max-w-lg leading-relaxed">
            "From the flower by the sea to Bangkok after dark — you know our story by heart!"
          </p>

          <div className="flex items-center gap-4 mb-4">
            <CharacterSprite role="billo" size={68} animation="celebrate" showHeart={true} showNameTag={true} />
            <div className="text-3xl text-pink-400 animate-pulse">💖</div>
            <CharacterSprite role="pillu" size={68} animation="celebrate" showHeart={true} showNameTag={true} />
          </div>

          <button
            onClick={() => {
              sound.playFanfare();
              onCompleteLevel();
            }}
            className="px-6 py-2.5 bg-gradient-to-r from-pink-500 via-rose-500 to-yellow-500 hover:from-pink-400 hover:to-yellow-400 text-black font-pixel text-[10px] sm:text-xs font-bold uppercase pixel-corners shadow-xl animate-pulse cursor-pointer"
          >
            Complete Level 2 & Go to Level 3 (The Heart Rush) →
          </button>
        </div>
      )}
    </div>
  );
};
