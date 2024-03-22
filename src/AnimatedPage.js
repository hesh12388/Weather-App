import {motion} from 'framer-motion';

const AnimatedPage = ({children}) =>{

    const animations = {
        initial: {y:50},
        animate: {y:0},
        exit: {y:-50},
    };
    return (
    <motion.div variants={animations} initial="initial" animate="animate" exit="exit" transition={{duration:1, ease: "easeOut"}}>
        {children}
    </motion.div>);
};

export default AnimatedPage;