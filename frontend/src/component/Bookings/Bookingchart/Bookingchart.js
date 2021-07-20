import React from 'react';
import { Bar as BarChart } from 'react-chartjs';

const Booking_Bucket = {
    Cheap: {
        min: 1,
        max: 10
    },
    Normal: {
        min: 11,
        max: 100
    },
    Expensive: {
        min: 101,
        max: 1000
    },

}

const BookingChart = (props) => {

    const chartdata = { labels: [], datasets: [] };
    let values = [];
    for (const bucket in Booking_Bucket) {
        const filterBookingcount = props.bookings.reduce((prev, current) => {
            if (current.event.price > Booking_Bucket[bucket].min && current.event.price < Booking_Bucket[bucket].max) {
                return prev + 1
            }
            else {
                return prev;
            }
        }, 0);
        values.push(filterBookingcount);
        chartdata.labels.push(bucket);
        chartdata.datasets.push({
            data: values,
            fillColor: "rgba(220,220,220,0.5)",
            sorkeColor: "rgba(220,220,220,0.8)",
            highlightFill: "rgba(220,220,220,0.75)",
            highlightStroke: "rgba(220,220,220,1)",

        });
        values = [...values];
        values[values.length - 1] = 0;
    }

    return (
        <BarChart data={chartdata} />
    )
}

export default BookingChart;