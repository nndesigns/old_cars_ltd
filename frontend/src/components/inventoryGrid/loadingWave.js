import { motion } from "framer-motion";

const containerVariants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05, // controls the wave timing
      repeat: Infinity, // repeat the whole wave
      repeatType: "reverse",
    },
  },
};

const letterVariants = {
  initial: { y: 0 },
  animate: { y: -8 }, // move letters up 10px
};

const letterTransition = {
  duration: 0.4,
  repeat: Infinity,
  repeatType: "reverse",
  ease: "easeInOut",
};

export const LoadingWave = ({
  text = "Loading..",
  size = "large",
  style = {},
}) => {
  return (
    <motion.div
      style={{
        display: "flex",
        color: "var(--invCardTitle)",
        gap: "0px",
        opacity: size === "small" ? ".6" : "",
        fontSize: size === "small" ? "1.25rem" : "2rem",
        fontWeight: /* size === "small" ? "light" : "bold" */ 550,
        textShadow: "0 0.15em 0.25em rgba(0, 0, 0, 0.25)",

        ...style,
      }}
      variants={containerVariants}
      initial="initial"
      animate="animate"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={index}
          variants={letterVariants}
          transition={letterTransition}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};
