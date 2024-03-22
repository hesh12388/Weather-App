import {useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import stars from './images/stars.png';
import './styles/kpWidget.css';
import helpbutton from './images/Vector.png';
import KpChart from './ChartWidget';
export default function KpWidget(){
    let time = (new Date()).getHours();
    let temptime=time;
    const [k_items, set_k_items] = useState([]);
    const [full_k_items, set_full_k_items] = useState([]);
    const [k_images, set_k_images]= useState([]);
    const [times, set_times] = useState([]);
    // this function gets the kp forecast for the rest of the day using noaa api
    // we wrap this function in useCallback, and use the current hour as a dependency
    // whenever the current hour changes, we fetchKp method changes
    const fetchKp = useCallback(async()=>{
        
        try{
            const response= await axios.get(`https://services.swpc.noaa.gov/text/3-day-geomag-forecast.txt`);
            let sliced_response = response.data.slice(510);
            let k_indexs=[];
            let colors =[]
            let i=0;
            // it is a txt file so we had to parse through it slide by slice
            while(k_indexs.length<8){
                // the k index is between index 16 and 20
                k_indexs.push(Math.round(sliced_response.slice(16, 20)));
                // based on the value of the k index, we push the corresponding color to a colors array
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
                // the we slice the response by 46 characters which aligns with the next line
                sliced_response=sliced_response.slice(46);
            }

            set_full_k_items(k_indexs);
            //  based what time it is which we got use Data object in Javascript, we only show some of the kp_indexes
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

            // we set the colors and k indexes in their respective state variables
            set_k_images(colors);
            set_k_items(k_indexs);

        }

        catch(error){
            console.error(error);
        }

        
    }, [new Date().getHours()]);
        
    
    // when fetchKp method changes, we call the fetchKp function
    // fetchKp function changes when the hour changes
    // so essentially we call the fetchKp function when the hour changes
    useEffect(()=>{
        fetchKp();
    }, [fetchKp]);


    useEffect(()=>{
        const array = [];
        let temp_time = new Date().getHours();
        for(let i=0; i<full_k_items.length; i++){
            if(temp_time>23){
                temp_time = temp_time - 24;
            }
            array.push(temp_time);
            temp_time+=3.;
        }
        set_times(array);
    }, [new Date().getHours()])

    function handleHelpButton(){
        const helpmessage = document.getElementById('helpmessage');
        const helpButton = document.getElementById('helpbutton');
        const kpheader = document.getElementById('kp-header');
        helpButton.style.display ='none';
        kpheader.style.display = 'none';
        helpmessage.style.display = 'inline';
    }

    function handleHelpButtonOut(){
        const helpmessage = document.getElementById('helpmessage');
        const kpheader = document.getElementById('kp-header');
        const helpButton = document.getElementById('helpbutton');
        helpmessage.style.display = 'none';
        kpheader.style.display = 'flex';
        helpButton.style.display ='inline';
    }


    return (

        <div id="full-kp">
            <div id="kp-forecast">
                <div id="kp-heading">
                    <div id="kp-header">
                        <img src={stars} alt="stars" />
                        <section id="kp-title">KP INDEX</section>
                    </div>
                    <img src={helpbutton} alt="helpbutton" id="helpbutton"onMouseOver={()=>{handleHelpButton();}} onMouseOut={()=>{handleHelpButtonOut();}}/>
                    <section id="helpmessage">
                        ↑ Kp = ↑ chance of Aurora
                    </section>
                </div>
                <div id="kp-widget">
                {
                    // for every k_index in the k_indexs, we show the value and also the corresponding color
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
                                {k_item}
                            </section>
                            <span class="dot" style={{backgroundColor:k_images[i]}}></span>
                        </div>
                    )
                })
                }
            </div>
                
            </div>
            <KpChart xAxis={times} yAxis={full_k_items} id="kp-chart"/>
        </div>
        
    )
}