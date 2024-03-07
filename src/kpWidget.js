import {useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import stars from './stars.png';
import './kpWidget.css';
import helpbutton from './Vector.png';
export default function KpWidget(){
    let time = (new Date()).getHours();
    let temptime=time;
    const [k_items, set_k_items] = useState([]);
    const [k_images, set_k_images]= useState([]);
    const fetchKp = useCallback(async()=>{
        
        try{
            const response= await axios.get(`https://services.swpc.noaa.gov/text/3-day-geomag-forecast.txt`);
            let sliced_response = response.data.slice(510);
            let k_indexs=[];
            let colors =[]
            let i=0;
            while(k_indexs.length<8){
                k_indexs.push(sliced_response.slice(16, 20));
                if (k_indexs[i]<=3){
                    colors.push("#970C06");
                }

                else if(k_indexs[i]==4){
                    colors.push("#F2B109");
                }

                else if(k_indexs[i]==5){
                    colors.push("#D77809");
                }

                else{
                    colors.push("#196406");
                }
                i++;
                sliced_response=sliced_response.slice(46);
            }

            if (time<3){
                k_indexs = k_indexs.slice(0, 5);
            }

            else if(time<6){
                k_indexs = k_indexs.slice(1, 6);
            }

            else if(time<9){
                k_indexs = k_indexs.slice(2, 7);
            }

            else if(time<12){
                k_indexs = k_indexs.slice(3, 8);
            }

            else if(time<15){
                k_indexs = k_indexs.slice(4);
            }

            else if(time<18){
                k_indexs = k_indexs.slice(5);
            }

            else if(time<21){
                k_indexs = k_indexs.slice(6);
            }

            else{
                k_indexs = k_indexs.slice(7);
            }


            set_k_images(colors);
            set_k_items(k_indexs);

        }

        catch(error){
            console.error(error);
        }

        
    }, [new Date().getHours()]);
        
    
    useEffect(()=>{
        fetchKp();
    }, [fetchKp]);





    return (

        <div id="kp-forecast">
            <div id="kp-heading">
                <div id="kp-header">
                    <img src={stars} alt="stars" />
                    <section id="kp-title">KP INDEX</section>
                </div>
                <img src={helpbutton} alt="helpbutton" />
            </div>
            <div id="kp-widget">
              {
               k_items.map((k_item, i) =>{
                return(
                    <div key={i} id="kp-index">
                        <section id="time">
                            {i==0?(
                                <>
                                Now
                                </>
                            ):(
                                <>
                                {temptime+=3}
                                </>
                            )
                            }
                        </section>
                        <img src={stars} alt="stars" id="stars-icon" />
                        <section id="kp-value">
                            {Math.round(k_item)}
                        </section>
                        <span class="dot" style={{backgroundColor:k_images[i]}}></span>
                    </div>
                )
               })
            }
        </div>
        </div>
        
    )
}