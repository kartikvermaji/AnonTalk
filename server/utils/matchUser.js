import USERS from '../models/user.js'; 

const findMatch = async (userId) => {
  // Fetch current user
  const user = await USERS.findById(userId);

  // Find a partner based on preferences
  const partner = await USERS.findOne({
    isSearching: true,
    // gender: user.partnerGender === "any" ? { $in: ["male", "female", "other"] } : user.partnerGender,
    partnerGender: { $in: ["any", user.gender] },
    _id: { $ne: userId },
  });

  if (partner) {
    // Update both users to stop searching and connect them
    user.chatPartner = partner._id;
    partner.chatPartner = user._id;
    user.isSearching = false;
    partner.isSearching = false;

    await user.save();
    await partner.save();

    return partner.telegramId;
  }

  return null;
};

export default findMatch;


//  import USERS from '../models/user.js'; 

// // No need to find the user again
// const findMatch = async (user) => { // Receive the full user object
//   // const user = await USERS.findById(userId); // DELETE this line

//   const partner = await USERS.findOneAndUpdate({
//     isSearching: true,
//     partnerGender: { $in: ["any", user.gender] },
//     _id: { $ne: user._id }, // Use user._id directly
//   },{
//     isSearching: false,
//     chatPartner: user._id // Use user._id directly
//   },{
//     new: true
//   });

//   if (partner) {
//     user.chatPartner = partner._id;
//     user.isSearching = false;
//     await user.save();
//     return partner.telegramId;
//   }

//   return null;
// };
//  export default findMatch;