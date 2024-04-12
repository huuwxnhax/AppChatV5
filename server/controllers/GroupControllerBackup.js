// import GroupModel from "../models/groupModel.js";

// export const createChatGroup = async (req, res) => {
//     const newChatGroup = new GroupModel({
//         name: req.body.name,
//         members: req.body.members,
//     });
//     try {
//       const result = await newChatGroup.save();
//       res.status(200).json(result);
//     } catch (error) {
//       res.status(500).json(error);
//     }
// };

// export const userChatGroups = async (req, res) => {
//     try {
//       const chatGroup = await GroupModel.find({
//         members: { $in: [req.params.userId] },
//       });
//       res.status(200).json(chatGroup);
//     } catch (error) {
//       res.status(500).json(error);
//     }
// };