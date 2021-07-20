const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require("../../models/booking");

const { tranfromBooking, transformEvent } = require('./merge');
const { dateTosting } = require("../../helpers/date");

module.exports = {
    createEvent: async (root, body, context, info) => {
        try {
            if (!context) {
                throw new Error("unauthenticated!");
            }
            const event = await new Event({
                title: body.eventInput.title,
                description: body.eventInput.description,
                price: body.eventInput.price,
                date: dateTosting(body.eventInput.date),
                creator: context.id
            });
            const result = await event.save()
            createEvent = transformEvent(result)
            const user = await User.findOne({ _id: context.id })
            if (!user) {
                throw new Error("user not found");
            }
            await user.createEvents.push(event);
            await user.save();
            return createEvent;

        }
        catch (error) {
            throw error;
        }
    },
    createUser: async (root, body, context, info) => {
        const userExits = await User.findOne({ email: body.userInput.email })
        if (userExits) {
            throw new Error("User already exits");
        }
        const hashpassword = await bcrypt.hash(body.userInput.password, 12)
        const user = await new User({
            email: body.userInput.email,
            password: hashpassword
        })
        const result = await user.save();
        return { ...result._doc, _id: result._id };
    },
    bookEvent: async (root, body, context, info) => {
        try {
            if (!context) {
                throw new Error("unauthenticated!");
            }
            const fetchevent = await Event.findOne({ _id: body.eventId });
            const booking = await new Booking({
                user: context.id,
                event: fetchevent
            });
            const result = await booking.save();
            return tranfromBooking(result)
        }
        catch (error) {
            throw error;
        }
    },
    cancelBooking: async (root, body, context, info) => {
        try {
            if (!context) {
                throw new Error("unauthenticated!");
            }
            const booking = await Booking.findById(body.bookingId).populate('event');
            const event = transformEvent(booking.event);
            await Booking.deleteOne({ _id: body.bookingId });
            return event;
        }
        catch (error) {
            throw error;
        }
    }
}