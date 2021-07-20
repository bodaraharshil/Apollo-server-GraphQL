const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");
const bcrypt = require('bcryptjs')
const JWT = require('jsonwebtoken');

const { transformEvent, tranfromBooking } = require("./merge");

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map((event) => {
                return transformEvent(event);
            })
        }
        catch (error) {
            throw error;
        }
    },
    bookings: async (root, body, context, info) => {
        try {
            if (!context) {
                throw new Error("unauthenticated!");
            }
            const bookings = await Booking.find({ user: context.id });
            return bookings.map((booking) => {
                return tranfromBooking(booking);
            })
        }
        catch (error) {
            throw error;
        }
    },
    login: async (root, body, context, info) => {
        const user = await User.findOne({ email: body.email });
        if (!user) {
            throw new Error('User does not exits');
        }

        const isEqual = await bcrypt.compare(body.password, user.password);
        if (!isEqual) {
            throw new Error("password is incorrect");
        }
        else {
            const token = await JWT.sign({ email: user.email, id: user.id }, 'somesupersecretkey', {
                expiresIn: '1h'
            });

            return { userId: user.id, token: token, tokenExpiration: 1 };

        }
    }
}