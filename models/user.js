const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    first_name: { type: String, minlength: 2, required: true },
    last_name: { type: String, minlength: 2, required: true },
    username: { type: String, minlength: 5, required: true },
    password: { type: String, required: true, minlength: 6 },
    member: { type: Boolean, required: true },
    admin: { type: Boolean, required: true },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
});

UserSchema.virtual('full_name').get(function () {
    return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model('User', UserSchema);
