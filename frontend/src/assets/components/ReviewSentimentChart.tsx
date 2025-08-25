import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import React from "react";
import type { IReview } from "../pages/OrganiserEventDashboard";


const ReviewSentimentChart = ({ reviews }: { reviews: IReview[]|undefined }) => {
    console.log("revi",reviews);
    
     const safeReviews = Array.isArray(reviews) ? reviews : [];
  const sentimentCounts = safeReviews.reduce(
    (acc, review) => {
      const sentiment = review.sentiment?.toUpperCase();

      if (sentiment === "POSITIVE") acc.POSITIVE += 1;
      else if (sentiment === "NEGATIVE") acc.NEGATIVE += 1;
      else if (sentiment === "NEUTRAL") acc.NEUTRAL += 1;

      return acc;
    },
    { POSITIVE: 0, NEGATIVE: 0, NEUTRAL: 0 }
  );

  const data = [
    { name: "Positive", value: sentimentCounts.POSITIVE },
    { name: "Negative", value: sentimentCounts.NEGATIVE },
    { name: "Neutral", value: sentimentCounts.NEUTRAL },
  ];

  const COLORS = ["#4CAF50", "#F44336", "#FFC107"];

  if (data.every((item) => item.value === 0)) {
    return <p className="text-gray-500">No sentiment data available</p>;
  }

  return (
    <PieChart width={400} height={300}>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        outerRadius={100}
        dataKey="value"
        label
      >
        {data.map((entry, index) => (
          <Cell key={index} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

export default ReviewSentimentChart;
