// src/components/AddReview.js
import React, { useState } from "react";
import axios from "axios";
import { AiOutlineAliwangwang } from "react-icons/ai";


const AddReview = ({ onReviewAdded }) => {
    const [comment, setComment] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                "http://localhost:2000/api/v2/add-service-reviews",
                { comment },
                {
                    headers: {
                        authorization: `bearer ${token}`,
                    },
                }
            );

            setComment("");
            onReviewAdded();
        } catch (err) {
            console.error("Failed to add review:", err);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-4 p-4 bg-black text-white rounded-3 shadow-lg border border-secondary"
        >
            <h5 className="mb-3 text-warning fs-4 fw-bold">Share Your Experience...</h5>

            <div className="mb-3">
                <textarea
                    className="form-control p-3 rounded-3 shadow-sm"
                    placeholder="Write your review..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="4"
                    required
                />
            </div>

            <button
                type="submit"
                className="text-black bg-[#f9a826] flex hover:opacity-90 gap-2 transition-opacity duration-300 font-semibold px-4 py-2 rounded-xl shadow-md"
            >
                <AiOutlineAliwangwang className="text-black text-2xl text-center" /> Submit Review
            </button>

        </form>
    );
};

export default AddReview;
