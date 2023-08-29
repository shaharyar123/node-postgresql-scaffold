import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
  },
  first_name: {
    type: String,
    required: [true, 'Please add first name'],
  },
  last_name: {
    type: String,
    required: [true, 'Please add last name'],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
  },
},
{
  timestamps: true,
}
);

const Users = mongoose.model('Users', userSchema);

export default Users;