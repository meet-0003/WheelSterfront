import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { GiGearStickPattern } from "react-icons/gi";
import { PiSeatFill } from "react-icons/pi";
import { GiGasPump } from "react-icons/gi";
import { PiEngineFill } from "react-icons/pi";
import axios from "axios";

const Card = ({ data }) => {
    const [isBooked, setIsBooked] = useState(false);

    useEffect(() => {
        const checkAvailability = async () => {
            try {
                const response = await axios.get(`http://localhost:2000/api/v2/vehicle-availability/${data._id}`);
                setIsBooked(response.data.isBooked);
            } catch (error) {
                console.error("Error fetching vehicle availability:", error);
            }
        };

        checkAvailability();
    }, [data._id]);

    return (
        <Link to={`/get-vehicle-by-id/${data._id}`}>
            <div className="relative card border-none transition-all duration-200 hover:scale-90 bg-base-100 w-96 shadow-xl overflow-hidden">
                {/* Badge */}
                <div className={`absolute top-2 right-2 px-3 py-1 text-sm font-semibold rounded ${isBooked ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                    {isBooked ? "Booked for Today" : "Available"}
                </div>

                {/* Image */}
                <figure className='h-56 w-full'>
                    <img src={data?.url} alt="vehicles" className="h-full w-full object-cover" />
                </figure>

                {/* Card Body */}
                <div className="card-body">
                    <div className='text-start'>
                        <div className='flex justify-between'>
                            <h2 className="card-title text-2xl">{data.name}</h2>
                            <div className="card-title text-xl">{data.registrationNumber}</div>
                        </div>
                        <div className='flex justify-between'>
                            <h2 className='text-lg'>₹ {data.rent}/day</h2>
                            <div className=''>Rating : {data.rating} </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="card-actions justify-between flex mt-6">
                        <div className='flex flex-wrap justify-center items-center gap-4 w-full'>
                            <div className="flex flex-col items-center min-w-[60px] text-center">
                                <GiGearStickPattern size={"2rem"} className='text-[#f9a826]'/>
                                <span className='pt-2'>{data.gear}</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[60px] text-center">
                                <PiSeatFill size={"2rem"} className='text-[#f9a826]'/>
                                <span className='pt-2'>{data.seat} Seat</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[60px] text-center">
                                <GiGasPump size={"2rem"} className='text-[#f9a826]'/>
                                <span className='pt-2'>{data.pump}</span>
                            </div>
                            <div className="flex flex-col items-center min-w-[60px] text-center">
                                <PiEngineFill size={"2rem"} className='text-[#f9a826]'/>
                                <span className='pt-2'>{data.engine}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default Card;














// import React from 'react';
// import { Link } from "react-router-dom";

// import { GiGearStickPattern } from "react-icons/gi";
// import { PiSeatFill } from "react-icons/pi";
// import { GiGasPump } from "react-icons/gi";
// import { PiEngineFill } from "react-icons/pi";

// const Card = ({ data }) => {
//     return (
//         <Link to={`/get-vehicle-by-id/${data._id}`}>
//             <div className="card border-none transition-all duration-200 hover:scale-90  bg-base-100 w-96 shadow-xl overflow-hidden">
//                 <figure className='h-56 w-full'>
//                     <img
//                         src={data?.url}
//                         alt="vehicles"
//                         className="h-full w-full object-cover"
//                     />
//                 </figure>
//                 <div className="card-body">
//                     <div className='text-start'>
//                         <div className='flex justify-between'>
//                             <h2 className="card-title text-2xl">{data.name}</h2>
//                             <div className="card-title text-xl">{data.registrationNumber}</div>
//                         </div>
//                         <div className='flex justify-between'>
//                         <h2 className='text-lg'>₹ {data.rent}/day</h2>
//                         <div className=''>Rating : {data.rating} </div>
//                         </div>
//                     </div>
//                     <div className="card-actions justify-between flex mt-6">
//                         <div className='flex flex-wrap justify-center items-center gap-4 w-full'>
//                             <div className="flex flex-col items-center min-w-[60px] text-center">
//                                 <GiGearStickPattern size={"2rem"} className='text-[#f9a826]'/>
//                                 <span className='pt-2'>{data.gear}</span>
//                             </div>
//                             <div className="flex flex-col items-center min-w-[60px] text-center">
//                                 <PiSeatFill size={"2rem"} className='text-[#f9a826]'/>
//                                 <span className='pt-2'>{data.seat} Seat</span>
//                             </div>
//                             <div className="flex flex-col items-center min-w-[60px] text-center">
//                                 <GiGasPump size={"2rem"} className='text-[#f9a826]'/>
//                                 <span className='pt-2'>{data.pump}</span>
//                             </div>
//                             <div className="flex flex-col items-center min-w-[60px] text-center">
//                                 <PiEngineFill size={"2rem"} className='text-[#f9a826]'/>
//                                 <span className='pt-2'>{data.engine}</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </Link>
//     );
// }

// export default Card;
