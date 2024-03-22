import  {motion} from 'framer-motion';
import React from 'react';
import './styles/Loader.css'
import loading from './images/loading.png'
export default function Loader(){

    // we use the framer motion package to do the loading screen
    //instead of regular tags, we use motion tags
    // I used an image then set the animation to be rotation 360 degrees
    // then I set the transition to last 2 second and to be repeated infinitely with a linear ease

    return (
        <motion.div className='loader'>
            <motion.img src={loading} alt="loading" animate={{rotate:360}} transition={{ease:"linear", duration:2, repeat:Infinity}}/>
        </motion.div>
    )
}