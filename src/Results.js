import {useState} from 'react';  
import axios from 'axios';
function Results()
{
    const[from,setFrom]=useState("");    
    const[to,setTo]=useState("");       
    const[startDate,setStartDate]=useState("");
    const[returnDate,setReturnDate]=useState("");
    const[hotelData,setHotelData]=useState([]);  //this variable is intitialised as an empty array because it will store multiple hotel objects containing information about the hotel
    const [querySubmitted,setQuerySubmitted]=useState(false); //keeps track of whether the user has submitted any query, this prevents the "no properties found" message from displaying upon opening the app
    const[loadingResults,setLoadingResults]=useState(false); //this variable is used to track whether results are loading, so a message can be displayed to make it clear to the user that nothing abnormal is occurring
    //The following functions beginning with "change" update the state variables when the user modifies the content of the input boxes
    function changeFrom(event)
    {
        setFrom(event.target.value);
    }
    function changeTo(event)
    {
        setTo(event.target.value);
    }
    function changeStartDate(event)
    { 
        setStartDate(event.target.value);
    }
    function changeReturnDate(event)
    {
        setReturnDate(event.target.value);
    }
    /*validateInput() ensures that all input fields are filled in. If everything is filled in, it calls multiple 
    functions to get ready for fetching results from the API*/
    function validateInput()
    {
        const inputFrom=document.getElementById("From");
        const inputTo=document.getElementById("To");
        const inputStart=document.getElementById("StartDate");
        const inputReturn=document.getElementById("ReturnDate");
        if(inputFrom.value===''||inputTo.value===''||inputStart.value===''||inputReturn.value==='')
        {
            alert("Please ensure all input fields are filled in.");
        }
        else
        {
            setHotelData([]);  //resets the hotel data array to ensure that results from previous queries are not included in the current results data
            setQuerySubmitted(true)  
            setLoadingResults(true); //this will trigger a "Loading Results" message to be displayed in the DOM
            fetchHotelCity(to);     //calls the function that will translate the city name provided into a desination id used for fetching the data about the hotels
        }
    }
    async function fetchHotelCity(destinationCity) 
    {
        const headers=
        {
            'X-RapidAPI-Key': 'd3e773cfbbmsh969fb38e5d05e4cp1eb2e9jsnbf64876767cd',
            'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
        }
        const params=
        {
            text:`${destinationCity}`
        }
        try
        {
            const response=await axios.get('https://apidojo-booking-v1.p.rapidapi.com/locations/auto-complete',{headers,params}); //making a request for the dest_id 
            fetchHotelData(response.data[0].dest_id); /*passing the destination id of the first object in the array of destinations
            returned by the API to the function fetchHotelData() The first element is chosen because it is most likely 
            to be the destination the user meant.*/
        }
        catch(error)
        {
            setLoadingResults(false);  //if an error occurs, the "loading results" message stops being displayed
            window.alert("Something went wrong finding the destination provided. Please ensure that you type the name of a city,optionally followed by the country e.g. Oslo Norway.");
            //an alert pops up notifying the user of the issue and how it can be resolved
        }
    }
    async function fetchHotelData(destId)
    {
        const headers=
        {
            'X-RapidAPI-Key': 'd3e773cfbbmsh969fb38e5d05e4cp1eb2e9jsnbf64876767cd',
            'X-RapidAPI-Host': 'apidojo-booking-v1.p.rapidapi.com'
        }
        const params=
        {
            offset:0,
            arrival_date:`${startDate}`,
            departure_date:`${returnDate}`,
            guest_qty:1,
            dest_ids:destId, //the value of this parameter was fetched by the previous API call 
            room_qty:1,
            search_type:'city'  /*the app is configured to search by city name rather than district name as tourists don't necessarily
             stick to a particular area within the city*/
        }
        try
        {
            const response=await axios.get('https://apidojo-booking-v1.p.rapidapi.com/properties/v2/list',{headers,params}); 
            setLoadingResults(false);  //now that the results have been fetched (the most time consuming task), the loading message is no longer visible
            response.data.result.map((arrayElement)=>  //loops through each result returned by the API
            {
                //if the result object is information about a property, we append it to the hotelData array, otherwise we just print "Not a property" to the console
                arrayElement.type==='property_card' ? updateHotelData(arrayElement):console.log("Not a property.");
            })
        }
        catch(error)
        {
            setLoadingResults(false); 
            window.alert("Something went wrong fetching the data. Ensure that the dates provided are not in the past."); /*this error can be caused
            by an issue with the API, e.g. API call allowance exceeded, or due to erroneous input (like dates in the past)*/
        }
    }
    function updateHotelData(element)
    {
        //initialising a hotelObject constant, extracting only the relevant information needed for this application from the API
        const hotelObject=
        {
            hName:element.hotel_name,
            hType:element.accommodation_type_name,
            hImage:element.main_photo_url,
            minPrice:element.min_total_price,
            currency:element.currency_code,
            score:element.review_score
        }
        setHotelData(h=>[...h,hotelObject]); /*react spread operator is used to copy the existing contents of the 
        hotelData array. The new hotelObject is then appended.*/
    }
    return( //the onChange HTML attribute is necessary for the state of variables to change
    <>
    <div id="travelInfo">
        <div id="fromTo">
            <label id='label1'>From 
                <input id='From' type="text" value={from} placeholder="Enter a city name" onChange={changeFrom}></input>
            </label>
            <label id='label2' >To
                <input id='To' type="text" value={to} placeholder="Enter a city name" onChange={changeTo}></input>
            </label>
        </div>
        <div id="startEnd">
            <label id='label3'>Start
                <input id='StartDate' type="date" value={startDate} onChange={changeStartDate}></input>
            </label>
            <label id='label4'>Return
                <input id='ReturnDate' type="date" value={returnDate} onChange={changeReturnDate}></input>
            </label>
        </div>
        
    </div>
    <div id="findResultsButton">
            <button id='button' onClick={validateInput}>Find Results</button>
        </div>
    <div id="resultsTextContainer">
        {//in this container, either "Results" is rendered or "Loading Results" is rendered based on the state of the loadingResults variable
        loadingResults===true ? <div><h2 id="ResultsText">Loading Results...</h2></div>:<h2 id="ResultsText">Results:</h2>}
    </div>
    <div id="hotelResults">
        {/*the "no properties" message is rendered if a user has submitted a query, there are no objects contained within the hotelData array,
        and the results are not currently loading*/
        hotelData.length===0 && querySubmitted===true && loadingResults===false ? 
        <div id="noPropertiesFound">
            <img alt="" src="https://cdn.pixabay.com/photo/2013/07/12/12/40/abort-146096_1280.png"></img>
            <h1>No results found.</h1>
            <p>Ensure you have entered a city e.g. Oslo or Oslo Norway, and that dates provided are not in the past.</p>
        </div>:console.log("Properties found.")}
        {//every hotel object is mapped to a div element which contains the information about the hotel that is rendered
        hotelData.map((hotel,index)=>  //an index is used for every div containg a hotelObject so that the browser can tell each div element apart
        <div key={index}>
            <ul id="listOfHotelInfo">
                <div id="hotel">
                    <img alt="hotel" src={hotel.hImage} id="image"></img>
                    <li id="hotelName">{hotel.hName}</li>
                </div>
                {/* <li id="typeOfAccommodation">{hotel.hType}</li> */}
                <div>
                <li id="review">Review Score: {hotel.score}</li>
                <li id="price">Prices from {Math.trunc(hotel.minPrice)} {hotel.currency}</li>
                </div>
            </ul>
        </div>)}
    </div>
    </>
    )
}
export default Results;  //the component is exported so that it can be used in the main App.js file
