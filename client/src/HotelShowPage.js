import {useContext, useState, useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import GlobalContext from './GlobalContext';
import StarRating from './StarRating';
import ReviewHotelModal from './ReviewHotelModal';
import Axios from 'axios';
import {Image} from 'react-bootstrap'

function HotelShowPage () {

    const location = useLocation();
    const navigate = useNavigate();
    const contextInfo = useContext(GlobalContext);
    const {currentUserState, 
        isRoomAvailableOrNot, 
        dateRangeArray,
        renderURL
    } = contextInfo;

    const hotel = location.state.hotel;

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [hotelInfoState, setHotelInfoState] = useState();

    useEffect(() => {
        Axios.get(`${renderURL}/api/hotels/${hotel._id}/`)
            .then((response) => {
                setHotelInfoState(response.data);
            })
            .catch((error) => {
                console.log(error.response.data);
            }) 
    }, [])

    function navigateToConfirmBookingPage (room) {
        navigate('/ConfirmBookingPage', {state: {room: room, hotel: hotel} }); 
    }

    function displayBookButtonAndIfItsAvailableOrNot (room) {
    
        if (currentUserState && dateRangeArray && isRoomAvailableOrNot(dateRangeArray, room.unavailableDates)) {
            return <button 
                        className='btn btn-danger btn-lg'
                        onClick={() => {navigateToConfirmBookingPage(room)}}
                    >Book
                    </button>
        } else if (!isRoomAvailableOrNot(dateRangeArray, room.unavailableDates)) {
            return <p style={{color: 'red'}}>Unavailable</p>
        } 
    }

    function displayRooms () {
        if (hotelInfoState) {
           const displayedRooms = hotelInfoState.rooms.map((room, i) => {
            console.log(i)
            return (
                <div className='single-room-displayed' key={room + i}>

                    <div>
                        <Image src={require(`../pics/hotelRoom${i}.jpg`)} alt={room.name} fluid/>
                    </div>

                    <div id="room-info" className="room-info-container">
                        <div className="price-container">
                            <h1 className='price'>${room.price}</h1>
                        </div>
                        <h1>{room.name}</h1>
                        <p style={{color: 'green'}}>Free Wifi & breakfast</p>
                        <p style={{color: 'green'}}>Fully refundable</p>
                        {/* Show if the room is available here or not, based on unavailableDates array */}
                        {displayBookButtonAndIfItsAvailableOrNot(room)}
                    </div>
                
                </div>
            )})
            return displayedRooms; 
        }
    }

    function backtoresults () {
        navigate('/search');
    }

    function displayReviews() {
        const displayed = hotelInfoState.reviews.map((review) => {
            const createdAt = new Date(review.createdAt);
            const formattedDate = `${createdAt.getMonth() + 1}-${createdAt.getDate()}-${createdAt.getFullYear()}`;
            
            return (
                <div className='single-review' key={review._id}>
                    <p className="review-date">Date: {formattedDate}</p><h1 className="review-username">{review.username}</h1>
                    <p className="review-text">{review.text}</p>
                    <p className="review-rating">Rating: {review.rating}/5</p>
                    <StarRating rating={(review.rating)}/>
                </div>
            );
        })
        return displayed.reverse();
    }

    function getAverageRating () {
        if (hotelInfoState && hotelInfoState.reviews.length) {
            const totalRating = hotelInfoState.reviews.reduce((sum, review) => sum + review.rating, 0);
            const averageRating = (totalRating / hotelInfoState.reviews.length).toFixed(1);
            return parseFloat(averageRating); // Convert the result back to a float (optional)
          } else {
            return 0.0; // Default value if there are no reviews
          }   
    }

    return (
        <div className='App'>
            <div className='hotel-show-container'>
                
            {showReviewModal ?
                <ReviewHotelModal 
                    setShowReviewModal={setShowReviewModal}
                    setHotelInfoState={setHotelInfoState}
                    hotelInfoState={hotelInfoState}
                />
            :
            ""}

            <button onClick={backtoresults} className='btn btn-danger btn-lg back-to-search-results-button'>
            <i class="fa fa-long-arrow-left" aria-hidden="true"></i>

            </button>

                {
                    dateRangeArray ?
                    <h1>Selected Duration: {dateRangeArray[0]} - {dateRangeArray[dateRangeArray.length-1]}</h1>
                    :
                    ""
                }

                <h1>{hotel.name}</h1>
                <p className='hotel-description-in-show-page'>{hotel.description}</p>
                <img className="hotel-pic-in-show-page" 
                src={hotel.picUrl}>  
                </img>

                {/* display rooms */}
                <h2>Rooms:</h2>
                {currentUserState ? <h1></h1> : <h1 style={{color: 'red'}}>Please Log In To Book.</h1>}
                <div className='displayed-rooms-container'>
                    
                    {displayRooms()}
                </div>

            </div>

            {/* reviews */}
            <div className='reviews-container'>
                <h1>{hotelInfoState && hotelInfoState.reviews.length > 0 ? hotelInfoState.reviews.length : ""} Reviews:</h1>

                {/* review button only if user is signed in */}

                {currentUserState ?
                    <>
                        <p>Stayed here before? Review your experience!</p>
                        <button onClick={() => setShowReviewModal((prevState) => !prevState)} className='btn btn-primary btn-lg'>Review</button>
                    </>
                :
                    <p>Please log in to review.</p>
                }

                <h1 className='average-rating-in-show-page'>{getAverageRating()}/5</h1>

                {hotelInfoState && hotelInfoState.reviews.length < 1 ?
                    <p>This hotel has no reviews yet.</p>
                : 
                   hotelInfoState ? 
                    displayReviews()
                    :
                    ""
                }
            </div>
           
            
        </div>
    )

}


export default HotelShowPage;