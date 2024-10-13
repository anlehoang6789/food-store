import http from "@/lib/http";
import {
  AccountResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  meProfile: () => http.get<AccountResType>("/accounts/me"),
  updateMeProfile: (data: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", data),
};

export default accountApiRequest;
