import React, {useEffect, useState, useCallback, useContext} from 'react';
import axios from 'axios';
import {LocationContext} from './App';
import './styles/PinnedLocations.css';
import { useNavigate } from "react-router-dom";

export default function PinnedLocations(){

    

    let navigate = useNavigate();
    const {pinnedLocations, setPinnedLocations, setLocation} = useContext(LocationContext);
    const [pinnedLocationsData, setPinnedLocationsData] = useState(null);
    const [videos_arr, setVidArr] = useState([]);
    async function getPinnedLocationsData(){
        const video_arr=[];
        const main_arr=[]
        for(let i=0; i<pinnedLocations.length; i++) {
            try{
                const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${pinnedLocations[i]}&units=metric&appid=3a033236f4f8307f5a37e24b25696226`);
                let desc=response.data.weather[0].description;

                if(desc.includes('clouds')){
                    desc="cloudy";
                }
                else if(desc.includes('rain')){
                    desc="rainy";
                }
                else if(desc.includes('snow')){
                    desc="snowy";
                }
                else if(desc.includes('sun')){
                    desc="sunny";
                }
                else{
                    desc=desc;
                }
                const url = "https://api.pexels.com/videos/search?query=" + desc+ "&orientation=landscape&size=large";
                const vid = await axios.get(url, {
                    headers: {
                        Authorization: "3qvJPiostW118QFeL1jQ26Oj5OAFzAaxsgtKvbouFlH1yFNNYEZOJBru"
                    }});
                video_arr.push((vid.data.videos[Math.floor(Math.random() * 14)].video_files[0].link));
                const arr = [pinnedLocations[i], response.data.main.temp, response.data.weather[0].description, Math.round(response.data.main.temp_max), Math.round(response.data.main.temp_min)];
                setVidArr(video_arr);
                main_arr.push(arr);
    
            }
            catch(error){
                console.error(error);
            }
        }
        setPinnedLocationsData(main_arr)
    }
    

    useEffect(()=>{
        getPinnedLocationsData();
    }, [])

 
    function handleLocationClick(i){
        setLocation(pinnedLocations[i]);
        navigate("/");
    }
    return(
    <div id="pinnedLocations">

        <div id="title-pinned">
            Weather
        </div>
        { pinnedLocationsData ? (
                   pinnedLocationsData.map((location , i) =>{
                    return (
                        <div id="pinnedLocation" onClick={ () => {handleLocationClick(i);}}>
                             {videos_arr.length>0 && (
                                    <video muted="muted" autoPlay="autoPlay" loop="loop" id="pinnedVid">
                                        <source src={videos_arr[i]} type="video/mp4"></source>
                                    </video>
                                )}
                            <div id="grid-container" key={i}>
                                <section id="Location-Name">{location[0]}</section>
                                <section id="Temperature">{location[1]}°</section>
                                <section id="Location-Description">{location[2]}</section>
                                <section id="High-Low"> H:{location[3]}° {"  "} L:{location[4]}°</section>
                            </div>
                        </div>
                            
                    )
                })
        ):
        (
            <></>
        )
        }
    </div>
    )
}