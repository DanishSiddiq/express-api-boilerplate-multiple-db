import mongoose from 'mongoose';

const rewardsSchema = new mongoose.Schema(
    { any: {} },
    {
        strict: false,
        versionKey: false,
        bufferCommands: false,
        validateBeforeSave: false,
        timestamps: true,
    },
);

module.exports = { rewardsSchema };
