import Actions from "../models/actions.js";

export const saveManyactions = async (actionArray) => {
  // console.log(actionArray.length);
  const actions = await Actions.insertMany(actionArray, {
    ordered: false,
  }).catch((err) => console.log(err));
  //   console.log(actions);
  return actions;
};
