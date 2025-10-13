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

export const LoadingWave = ({ text = "Loading..", size = "large" }) => {
  return (
    <motion.div
      style={{
        display: "flex",
        gap: "0px",
        opacity: size === "small" ? ".6" : "",
        fontSize: size === "small" ? "1.25rem" : "2rem",
        fontWeight: size === "small" ? "light" : "bold",
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
