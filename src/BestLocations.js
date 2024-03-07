import React, {useState,useEffect, useCallback} from 'react';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import "leaflet/dist/leaflet.css";
import {useMap} from 'react-leaflet';
import {Marker} from 'react-leaflet';
import axios from 'axios';
import {Icon} from 'leaflet';
import locate from './pin.png';
import markerIcon from './markerIcon.png';
import searchButton from './search.png';
import Nav from "./Nav";
import './BestLocations.css';
import Loader from './Loader.js';
export default function BestLocations(){
    const [nearestLocations, setNearestLocations] = useState(null);
    const [position, setPosition] = useState([53.54992,10.00678]);
    const [locationAndRadius, setLocationAndRadius] = useState([null, null, 12000]); 


    const icon = new Icon({
        iconUrl:markerIcon,
        iconSize:[38, 38]

    })
    async function fetchLocation() {
        navigator.geolocation.getCurrentPosition(function (position){
            setLocationAndRadius([position.coords.latitude ,position.coords.longitude, locationAndRadius[2]]);
        }, ()=>{
            console.log("Couldn't get current location");
        })
    }

    async function fetchNearestLocations(){
        try{
            const response = await axios.get(`https://services.swpc.noaa.gov/json/ovation_aurora_latest.json`);
            console.log(response.data);
            var coordinatesArr = response.data.coordinates;
            coordinatesArr= filterByRadius(coordinatesArr);
            coordinatesArr= coordinatesArr.sort(sortFunction);
            coordinatesArr = shuffleArr(coordinatesArr.slice(0, 200));
            coordinatesArr = await findLocationNamesAndDistances(coordinatesArr.slice(0, 60));
            coordinatesArr= filterArr(coordinatesArr);
            var NearestLocations = coordinatesArr.slice(0,10).sort(sortByNearest);
            console.log(NearestLocations);
            setNearestLocations(NearestLocations);
        }

        catch(error){
            console.error(error);
        }
    }

    function shuffleArr(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }

        return array;
      }
    function sortFunction(a, b) {
        if(a[2]==b[2]){
            return 0;
        }

        else if(a[2]<b[2]){
            return 1;
        }
        else{
            return -1;
        }
    };

    function  filterByRadius(arr){
        const new_arr=[]
        for(let i=0; i < arr.length; i++){
            if (getDistance(arr[i])<locationAndRadius[2])
            {
                new_arr.push(arr[i])
            }
        }
        return new_arr;
    }

    function filterArr(arr){
       const new_arr = [];

        for(let i=0; i<arr.length; i++) {
            if(arr[i][3]!=""){
                new_arr.push(arr[i]);
            }
        }

        return new_arr;
    }


    useEffect(()=>{
        fetchNearestLocations();
    }, [locationAndRadius]);


    async function findLocationNamesAndDistances(arr){

        const new_arr = new Array(arr.length);

        for(let i = 0; i < new_arr.length; i++){
            var name;
            var dist = Math.round(getDistance(arr[i]));
            try{
                const response= await axios.get(`http://api.openweathermap.org/geo/1.0/reverse?lat=${arr[i][1]}&lon=${arr[i][0]-180}&limit=5&appid=3a033236f4f8307f5a37e24b25696226`);
                if(response.data.length>0){
                    name = response.data[0].name + " " +response.data[0].country;
                }
                else{
                    name="";
                }
            }

            catch(error){
                console.error(error);
            }

            new_arr[i]= [arr[i][0], arr[i][1], arr[i][2],name,dist];
        }
        
        return new_arr;

    }
 
    function getDistance(a){
            const currentlatitude = degrees_to_radians(locationAndRadius[0]);
            const currentlongitude = degrees_to_radians(locationAndRadius[1]);
            var a_lon = degrees_to_radians(a[0]-180);
            var a_lat = degrees_to_radians(a[1]);
            var distance= Math.acos((Math.sin(currentlatitude)*Math.sin(a_lat))+(Math.cos(currentlatitude)*Math.cos(a_lat)*Math.cos(a_lon-currentlongitude)))*6371;
            return distance;
    }

    
    function sortByNearest(a, b) {
        const distanceA=getDistance(a);
        const distanceB=getDistance(b);
        if(distanceA==distanceB){
            return 0;
        }

        else if(distanceA>distanceB){
            return 1;
        }
        else{
            return -1;
        }
    }

    function degrees_to_radians(degrees)
    {
    var pi = Math.PI;
    return degrees * (pi/180);
    }

    useEffect(()=>{
        fetchLocation();
    }, [])


    function handleLocationClick(index) {
        setPosition([nearestLocations[index][1], nearestLocations[index][0]-180]);
    }

    function ReCenter({position}){
        const map =useMap();
        useEffect(()=>{
            map.setView(position, 5);
        }, [position])
    }

    async function handleLocationSubmit(e){
        setNearestLocations(null);
        const location_name = document.getElementById("locationName").value;
        const radius_param = document.getElementById("radius").value;
        const coords = await getCoordinates(location_name);
        coords.push(radius_param);
        if(radius_param<=0){
            radius_param.value="Please Enter a valid radius"
            radius_param.style.color="red";
        }

        else if(coords==-1){
            location_name.value="Please Enter Valid Location";
            location_name.style.color="red";
        }

        else{
            setLocationAndRadius(coords);
        }
    }


    async function getCoordinates(location_name) {
        let res=""
        try{
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location_name}&units=metric&appid=3a033236f4f8307f5a37e24b25696226`);
            res=[response.data.coord.lat, response.data.coord.lon]
        }

        catch(error){
            console.error(error);
            res=-1
        }

        return res;
    }
    return (
        <>
        {nearestLocations ? (
            <div id="nearestLocation-page">
            <form id="nav-bar">
                <input type="text"  name="location" placeholder="Enter Location" id="locationName"/>
                <input type="number" name="radius" placeholder="Enter Radius" id="radius"/>
                <button type="button" onClick={handleLocationSubmit}>
                    <img id="search-button" src={searchButton} alt="Search" />
                </button>
            </form>

               <MapContainer center={position} zoom={5} id="map">
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {nearestLocations.map((location , i)=>(
                        <Marker key= {i} position={[location[1], location[0]-180]} icon={icon}>
                        </Marker>
                    ))}

                    <ReCenter position={position}/>
               </MapContainer>
        <div class="nearestLocations">
            {
                nearestLocations.map((location, i) =>{
                    return (
                        <div key={i} id="location">
                            <section id="location-title">
                                <section id="city-name">
                                    {location[3]}
                                </section>
                                <section id="distance">
                                    {location[4]} km away
                                </section>
                            </section>
                            <section id="aurora-percentage">
                                {location[2]}
                            </section>

                            <button onClick={() => handleLocationClick(i)}>
                                <img  id="locate"src={locate}  alt="locate"/>
                            </button>
                        </div>
                    )
                })
            }
        </div>
        <Nav/>
        </div>
        ) : (
            <div id="nearestLocation-page2">
                <Loader />
                <p>One Sec, it's loading....</p>
            </div>
        )}
        
        </>
       
    )
}