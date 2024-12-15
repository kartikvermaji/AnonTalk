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
