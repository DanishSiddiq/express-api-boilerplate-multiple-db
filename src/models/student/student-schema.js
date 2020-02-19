import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema(
    { any: {} },
    {
        strict: false,
        versionKey: false,
        bufferCommands: false,
        validateBeforeSave: false,
        timestamps: true,
    },
);

module.exports = { studentSchema };
