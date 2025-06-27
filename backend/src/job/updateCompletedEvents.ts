import EventModel from "../model/event";


export const updateCompletedEvents = async () => {
  const now = new Date();
  try {
    const result = await EventModel.updateMany(
      {
        status: { $in: ['published'] },
        date: { $lt: now }
      },
      {
        $set: { status: 'completed' }
      }
    );
   
  } catch (error) {
    console.error(' Error updating completed events:', error);
  }
};
