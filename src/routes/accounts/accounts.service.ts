import { IAcccounts } from "interfaces";
import { Accounts } from "../../models";
const getAccount = async (tokenId: string, paramId: string): Promise<any> => {
  const result = await Accounts.findById(paramId);
  if (result === null) return { status: false, message: "BAD_REQUEST" };
  const exists = result.users.some(o => o === tokenId);
  if (!exists) return { status: false, message: "ACCESS_DENIED" };
  return { status: true, data: { ...result["_doc"] } };
};
const updateAccount = async (tokenId: string, paramId: string, req: IAcccounts): Promise<any> => {
  const result = await Accounts.findById(paramId);
  if (result === null) return { status: false, message: "BAD_REQUEST" };
  const exists = result.users.some(o => o === tokenId);
  if (!exists) return { status: false, message: "ACCESS_DENIED" };
  const u = await Accounts.findByIdAndUpdate(paramId, req, { new: true });
  return { status: true, data: { ...u["_doc"] } };
};

export default { getAccount, updateAccount };
