import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const SYMBOLS = ['π', '∑', '√', '∫', 'x²', '∞', 'Δ', 'θ', 'sin x', 'cos x', 'dy/dx', '≠']

const HOLD_MS = 2400
const EXIT_MS = 850
const EASE = [0.16, 1, 0.3, 1]

export default function Intro({ onComplete }) {
    const [visible, setVisible] = useState(true)
    const [progress, setProgress] = useState(0)

    const rafRef = useRef(null)
    const startRef = useRef(null)

    const symbols = useMemo(
        () =>
            SYMBOLS.map((symbol, i) => ({
                symbol,
                x: `${8 + ((i * 17) % 84)}% `,
                y: `${10 + ((i * 29) % 78)}% `,
                rotate: i % 2 ? 12 : -12,
            })),
        []
    )

    useEffect(() => {
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        const tick = (time) => {
            if (!startRef.current) startRef.current = time

            const elapsed = time - startRef.current

            setProgress(
                Math.min(100, Math.round((elapsed / HOLD_MS) * 100))
            )

            if (elapsed < HOLD_MS) {
                rafRef.current = requestAnimationFrame(tick)
            }
        }

        rafRef.current = requestAnimationFrame(tick)

        const exitTimer = setTimeout(() => {
            setVisible(false)
        }, HOLD_MS)

        const completeTimer = setTimeout(() => {
            document.body.style.overflow = previousOverflow
            onComplete?.()
        }, HOLD_MS + EXIT_MS)

        return () => {
            cancelAnimationFrame(rafRef.current)
            clearTimeout(exitTimer)
            clearTimeout(completeTimer)
            document.body.style.overflow = previousOverflow
        }
    }, [onComplete])

    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    className="math-intro"
                    initial={{ opacity: 1 }}
                    exit={{
                        clipPath: 'inset(0 0 100% 0)',
                        transition: {
                            duration: EXIT_MS / 1000,
                            ease: EASE,
                        },
                    }}
                    aria-hidden="true"
                >
                    {/* Mathematical grid */}
                    <div className="math-intro-grid" />

                    {/* Decorative equations */}
                    <div className="math-intro-equation equation-a">
                        f(x) = x² + 2x + 1
                    </div>

                    <div className="math-intro-equation equation-b">
                        ∫₀∞ e⁻ˣ dx = 1
                    </div>

                    {/* Floating math symbols */}
                    {symbols.map((item, i) => (
                        <motion.span
                            key={`${item.symbol} -${i} `}
                            className="math-intro-symbol"
                            style={{
                                left: item.x,
                                top: item.y,
                            }}
                            initial={{
                                opacity: 0,
                                scale: 0.4,
                                rotate: item.rotate * 2,
                            }}
                            animate={{
                                opacity: [0, 0.42, 0.2],
                                scale: [0.4, 1, 0.9],
                                rotate: [
                                    item.rotate * 2,
                                    item.rotate,
                                    item.rotate * -0.4,
                                ],
                                x: [0, i % 2 ? -12 : 12, 0],
                                y: [0, i % 3 ? -18 : 14, 0],
                            }}
                            transition={{
                                duration: 2.1 + (i % 4) * 0.18,
                                delay: i * 0.045,
                                ease: 'easeInOut',
                                repeat: Infinity,
                                repeatType: 'mirror',
                            }}
                        >
                            {item.symbol}
                        </motion.span>
                    ))}

                    {/* Registration corners */}
                    <span className="math-intro-corner tl" />
                    <span className="math-intro-corner tr" />
                    <span className="math-intro-corner bl" />
                    <span className="math-intro-corner br" />

                    <div className="math-intro-center">

                        {/* Mathematical logo */}
                        <motion.div
                            className="math-intro-mark"
                            initial={{
                                scale: 0,
                                rotate: -90,
                                opacity: 0,
                            }}
                            animate={{
                                scale: 1,
                                rotate: 0,
                                opacity: 1,
                            }}
                            transition={{
                                duration: 0.65,
                                ease: EASE,
                                delay: 0.08,
                            }}
                        >
                            ∑
                        </motion.div>

                        {/* MR. E */}
                        <h1
                            className="math-intro-name"
                            aria-label="MR. E"
                        >
                            {'MR. E'.split('').map((char, i) => (
                                <span
                                    className="math-intro-char-mask"
                                    key={`${char} -${i} `}
                                >
                                    <motion.span
                                        className="math-intro-char"
                                        initial={{ y: '110%' }}
                                        animate={{ y: 0 }}
                                        transition={{
                                            duration: 0.65,
                                            ease: EASE,
                                            delay: 0.42 + i * 0.075,
                                        }}
                                    >
                                        {char === ' ' ? '\u00A0' : char}
                                    </motion.span>
                                </span>
                            ))}
                        </h1>

                        {/* Arabic name */}
                        <motion.div
                            className="math-intro-arabic"
                            initial={{
                                opacity: 0,
                                y: 12,
                            }}
                            animate={{
                                opacity: 1,
                                y: 0,
                            }}
                            transition={{
                                duration: 0.5,
                                ease: EASE,
                                delay: 0.95,
                            }}
                        >
                            مستر إسلام
                        </motion.div>

                        {/* Mathematical underline */}
                        <motion.div
                            className="math-intro-line"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                                duration: 0.65,
                                ease: EASE,
                                delay: 1.05,
                            }}
                        />

                        {/* Identity */}
                        <div className="math-intro-tagline">
                            {[
                                'MATH',
                                '•',
                                'BACALORIA',
                                '•',
                                'BEYOND',
                                'NUMBERS',
                            ].map((word, i) => (
                                <motion.span
                                    key={`${word} -${i} `}
                                    initial={{
                                        opacity: 0,
                                        y: 10,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        duration: 0.4,
                                        ease: EASE,
                                        delay: 1.15 + i * 0.055,
                                    }}
                                >
                                    {word}
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    {/* Footer / percentage */}
                    <motion.div
                        className="math-intro-footer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                            duration: 0.5,
                            delay: 0.35,
                        }}
                    >
                        <span>
                            MATHEMATICS • EDUCATION PLATFORM
                        </span>

                        <span>
                            {String(progress).padStart(3, '0')}%
                        </span>
                    </motion.div>

                    {/* Loading line */}
                    <div className="math-intro-progress">
                        <div
                            style={{
                                transform: `scaleX(${progress / 100})`,
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
