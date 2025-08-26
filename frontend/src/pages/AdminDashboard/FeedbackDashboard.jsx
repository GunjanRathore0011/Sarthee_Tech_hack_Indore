// src/components/FeedbackDashboard.jsx
import React, { useEffect, useRef, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import Autoplay from "embla-carousel-autoplay"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";


const FeedbackDashboard = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    console.log(feedbacks)


    const plugin = React.useRef(
        Autoplay({ delay: 3000, stopOnInteraction: false })
    )


    // Fetch feedbacks from API
    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/v1/admin/api/feedbacks"); // <-- apni API endpoint daalna
                if (!res.ok) throw new Error("Failed to fetch feedbacks");
                const data = await res.json();
                setFeedbacks(data.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedbacks();
    }, []);





    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center">
                <div className="animate-spin h-10 w-10 border-4 border-[#0473fb] border-t-transparent rounded-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500 font-semibold">
                {error}
            </div>
        );
    }



    // ---- Data Transformations ----
    // Rating distribution
    const distribution = [1, 2, 3, 4, 5].map((star) => ({
        star,
        count: feedbacks.filter((f) => f.rating === star).length,
    }));

    // Timeline average (group by date)
    const dateMap = {};
    feedbacks.forEach((f) => {
        const date = new Date(f.createdAt).toLocaleDateString();
        if (!dateMap[date]) dateMap[date] = { total: 0, count: 0 };
        dateMap[date].total += f.rating;
        dateMap[date].count += 1;
    });
    const timeline = Object.entries(dateMap).map(([date, val]) => ({
        date,
        avg: (val.total / val.count).toFixed(2),
    }));

    // Average rating
    const avgRating =
        feedbacks.length > 0
            ? (
                feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length
            ).toFixed(1)
            : 0;

    return (
        <div className="p-6 space-y-6">
            {/* Top Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Rating Distribution */}
                <div className="bg-white shadow-md rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-2">Rating Distribution</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={distribution}>
                            <XAxis dataKey="star" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0473fb" />
                            <defs>
                                <linearGradient id="siteGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#7C4A2D" />
                                    <stop offset="100%" stopColor="#D2B48C" />
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Average Rating */}
                <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col items-center justify-center">
                    <h2 className="text-lg font-semibold mb-2">Average Rating</h2>
                    <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#0473fb] to-[#042c70]">
                        {avgRating} ⭐
                    </div>
                    <p className="text-gray-500 mt-2">
                        Based on {feedbacks.length} reviews
                    </p>
                </div>

                {/* Timeline */}
                <div className="bg-white shadow-md rounded-2xl p-4">
                    <h2 className="text-lg font-semibold mb-2">Rating Trend</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={timeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 5]} />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="avg"
                                stroke="#0473fb"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#D2B48C" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="bg-white shadow-md rounded-2xl p-6">
                <h2 className="text-xl font-semibold mb-4">User Feedback</h2>
                <Carousel
                    plugins={[plugin.current]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-2 md:-ml-4">
                        {feedbacks.map((f, idx) => (
                            <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                                <Card className="h-full border border-gray-200 shadow-sm hover:shadow-md transition rounded-xl">
                                    <CardContent className="p-4 flex flex-col justify-between h-full">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-800">
                                                {f?.userDetails?.fullName || "Anonymous"}
                                            </span>
                                            <span className="text-yellow-500 text-sm">
                                                {"⭐".repeat(f.rating)}
                                            </span>
                                        </div>
                                        <p className="text-gray-700 text-sm line-clamp-4">
                                            {f?.description || "No feedback provided"}
                                        </p>
                                        <div className="mt-4 text-xs text-gray-500">
                                            <p>
                                                {f?.userDetails?.colony}, {f?.userDetails?.district}
                                            </p>
                                            <p>{new Date(f.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    {/* nav buttons still work on desktop */}
                    <CarouselPrevious className="hidden md:flex" />
                    <CarouselNext className="hidden md:flex" />
                </Carousel>
            </div>

        </div>
    );
};

export default FeedbackDashboard;
