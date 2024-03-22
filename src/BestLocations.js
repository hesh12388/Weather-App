import React, {useState,useEffect, useCallback} from 'react';
import { MapContainer } from 'react-leaflet/MapContainer'
import { TileLayer } from 'react-leaflet/TileLayer'
import "leaflet/dist/leaflet.css";
import {useMap} from 'react-leaflet';
import {Marker} from 'react-leaflet';
import axios from 'axios';
import {Icon} from 'leaflet';
import locate from './images/pin.png';
import markerIcon from './images/markerIcon.png';
import searchButton from './images/search.png';
import Nav from "./Nav";
import './styles/BestLocations.css';
import Loader from './Loader.js';
export default function BestLocations(){

    // these are the state variables that we will be using in this component
    const [nearestLocations, setNearestLocations] = useState(null);
    const [position, setPosition] = useState([53.54992,10.00678]);
    const [locationAndRadius, setLocationAndRadius] = useState([null, null, 12000]); 
    const [radius, updateRadius] = useState(1000);

    // here we our defining the icon that will be used as a marker on the app
    const icon = new Icon({
        iconUrl:markerIcon,
        iconSize:[38, 38]

    })

    // this function fetchs the current location fromm the user and then sets the state variable with it
    // it will prompt the user to accept or reject that the app can use their current location
    // if the user rejects, this if fine, as we have specified default values for the state variable above
    async function fetchLocation() {
        navigator.geolocation.getCurrentPosition(function (position){
            setLocationAndRadius([position.coords.latitude ,position.coords.longitude, locationAndRadius[2]]);
        }, ()=>{
            console.log("Couldn't get current location");
        })
    }

    //this functions fetches all the aurora visibility percentages for all coordinates on earth
    // we then filter them based on the the highest visibility and the radius the user has said
    // they want the locations to be within
    async function fetchNearestLocations(){
        try{
            const response = await axios.get(`https://services.swpc.noaa.gov/json/ovation_aurora_latest.json`);
            
            var coordinatesArr = response.data.coordinates;
            // we filter the array by radius
            coordinatesArr= filterByRadius(coordinatesArr);
            //then we sort by by highest aurora visibility
            coordinatesArr= coordinatesArr.sort(sortFunction);
            //then we take the first 200 and then shuffle them because coordinates near each other tend to have same visibility percentage
            coordinatesArr = shuffleArr(coordinatesArr.slice(0, 200));
            // then we take the sliced array and get the names and distances for each coordinate
            coordinatesArr = await findLocationNamesAndDistances(coordinatesArr.slice(0, 60));
            // then we filter the array by removing locations which have an unknown name
            coordinatesArr= filterArr(coordinatesArr);
            // then we take the first 10 locations, and sort them by distance to user's location
            var NearestLocations = coordinatesArr.slice(0,10).sort(sortByNearest);
            
            // then we set the nearest locations state variable with this array
            setNearestLocations(NearestLocations);
        }

        catch(error){
            console.error(error);
        }
    }
    // shuffles a given array
    function shuffleArr(array) {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }

        return array;
      }

      // sort function which we pass to sort method to sort an array
      //here we are sorting by aurora visibility
      // Index 2 of each array is the aurora visibility
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

    // removes coordinates from the array which are outside of specified radius
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

    // removes coordinates from the array which dont have a name
    function filterArr(arr){
       const new_arr = [];

        for(let i=0; i<arr.length; i++) {
            if(arr[i][3]!=""){
                new_arr.push(arr[i]);
            }
        }

        return new_arr;
    }


    // when the location/radius change when the user inputs new ones, we call the fetchNearestLocations method
    useEffect(()=>{
        fetchNearestLocations();
    }, [locationAndRadius]);

    // this function fetchs the location name and distance for each coordinate in the arr
    // we use the openweather app reverse geocoding to get the location name for given latitude and longitude
    async function findLocationNamesAndDistances(arr){

        const new_arr = new Array(arr.length);

        for(let i = 0; i < new_arr.length; i++){
            var name;
            // we used our defined getDistance method to get the distance between coordinate and user location
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
            // we set current index of the array to another array which hold the coordinates, aurora visibility percentage
            // name, and distance
            new_arr[i]= [arr[i][0], arr[i][1], arr[i][2],name,dist];
        }
        
        return new_arr;

    }
    // we defined this function to get the distance between the user location and the given coordinates
    function getDistance(a){
            // the formula only works for radians, not degrees, so I defined a method which converts degrees to radians
            const currentlatitude = degrees_to_radians(locationAndRadius[0]);
            const currentlongitude = degrees_to_radians(locationAndRadius[1]);
            // the noaa api providers coordinates in different format to so had to convert them
            var a_lon = degrees_to_radians(a[0]-180);
            var a_lat = degrees_to_radians(a[1]);
            // used this formula to compute distance between two coordinates on earth
            var distance= Math.acos((Math.sin(currentlatitude)*Math.sin(a_lat))+(Math.cos(currentlatitude)*Math.cos(a_lat)*Math.cos(a_lon-currentlongitude)))*6371;
            return distance;
    }

    // this is the sort function which we pass to the sort method
    //It sorts based on distance of each coordinate to the user location
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
    // this function converts degrees to radians
    function degrees_to_radians(degrees)
    {
    var pi = Math.PI;
    return degrees * (pi/180);
    }
    // on render, we call the fetchLocation method
    useEffect(()=>{
        fetchLocation();
    }, [])

    // when the user clicks the pin button, we set the position variable to be the position of the location they clicked
    function handleLocationClick(index) {
        setPosition([nearestLocations[index][1], nearestLocations[index][0]-180]);
    }
    // this component is used to recenter the view of the map to the position from the position variable
    // we used built in setView method to do this
    // we only set the view when the position variable changes
    // the position variable will only change when the user clicks on one of the pin buttons
    function ReCenter({position}){
        const map =useMap();
        useEffect(()=>{
            map.setView(position, 5);
        }, [position])
    }
    // when the user submits the form, we retrieve the location name and radius
    // if they are invalid, we inform the user via alert or highlighted text
    //otherwise the set the location and radius state variable to these inputs
    // this will cause the fetchNearestLocations method to be called
    async function handleLocationSubmit(e){
        const location_name = document.getElementById("locationName");
        const radius_param = document.getElementById("radius");
        const coords = await getCoordinates(location_name.value);
        coords.push(radius_param.value);
        
        if(radius_param.value<=0){
            window.alert("Please enter Valid Radius");
        }

        else if(coords[0]==-1){
            location_name.value="Please Enter Valid Location";
            location_name.style.color="red";
        }

        else{
            setNearestLocations(null);
            setLocationAndRadius(coords);
        }
    }

    // we use this method to get the coordinates of the location/city the user inputted
    //if the city is valid, it will return the coordinates
    // if it is invalid, we will return -1 so that we can handle this error in the above method
    async function getCoordinates(location_name) {
        let res=""
        try{
            const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${location_name}&units=metric&appid=3a033236f4f8307f5a37e24b25696226`);
            res=[response.data.coord.lat, response.data.coord.lon]
        }

        catch(error){
            console.error(error);
            res=[-1]
        }

        return res;
    }
    return (
        <>
        {nearestLocations ? (
            <div id="nearestLocation-page">
            <form id="nav-bar">
               
                    <input type="text"  name="location" placeholder="Enter Location" id="locationName"/>
                    <div id="radius-slider">
                            <section>Radius:</section>
                            <input type="range" min="1000" max="10000" onChange={()=>{updateRadius(document.getElementById("radius").value)}} class="slider" id="radius"/>
                            <section>
                                {radius}
                            </section>
                    </div>
        
                <button type="button" onClick={handleLocationSubmit}>
                    <img id="search-button" src={searchButton} alt="Search" />
                </button>
            </form>

    
                {/* we use react leaflet to include a map */}
                {/* we add a TileLayer which will be of the open street map */}
               <MapContainer center={position} zoom={5} id="map">
                    <TileLayer 
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {/* Then for every location in the nearest best Locations, we add a marker at the position
                     of this location on the map */}
                    {nearestLocations.map((location , i)=>(
                        <Marker key= {i} position={[location[1], location[0]-180]} icon={icon}>
                        </Marker>
                    ))}
                    {/* this is the component which allows us to change the view of the map when the user clicks on something
                    The recent we need this is because only a descendent of Map Container can change the view of the map. 
                    We can't just define a function and call it with OnClick for example */}
                    <ReCenter position={position}/>
               </MapContainer>
        <section id="best-location-title"> Best Locations near you:</section>
        <div class="nearestLocations">
            {
                // for each location in nearest locations, we create a box for it
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

                            <div id="aurora-flex">
                                <section id="aurora-percentage">
                                    {location[2]}
                                </section>

                                <button onClick={() => handleLocationClick(i)}>
                                    <img  id="locate"src={locate}  alt="locate"/>
                                </button>
                            </div>
                        </div>
                    )
                })
            }
        </div>
        <Nav/>
        </div>
        ) : (
            // if the nearest locations is null, then we just show a loading screen
            <div id="nearestLocation-page2">
                <Loader />
                <p>One Sec, it's loading....</p>
            </div>
        )}
        
        </>
       
    )
}