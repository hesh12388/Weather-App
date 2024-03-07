import  {motion} from 'framer-motion';
import React from 'react';
import './Loader.css'
import loading from './loading.png'
export default function Loader(){

    

    return (
        <motion.div className='loader'>
            <motion.img src={loading} alt="loading" animate={{rotate:360}} transition={{ease:"linear", duration:2, repeat:Infinity}}/>
        </motion.div>
    )
}