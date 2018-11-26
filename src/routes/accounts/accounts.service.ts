import { IAcccounts } from "interfaces";
import { Accounts } from "../../models";
const getAccount = async (accoundId: string): Promise<any> => {
  try {
    const result = await Accounts.findById(accoundId);
    return { status: true, data: { ...result["_doc"] } };
  } catch (error) {
    return { status: false, message: error };
  }
};
const updateAccount = async (accoundId: string, req: IAcccounts): Promise<any> => {
  try {
    const u = await Accounts.findByIdAndUpdate(accoundId, req, { new: true });
    return { status: true, data: { ...u["_doc"] } };
  } catch (error) {
    return { status: false, message: error };
  }
};

export default { getAccount, updateAccount };
