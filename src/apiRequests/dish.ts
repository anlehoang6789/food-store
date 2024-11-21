import http from "@/lib/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const dishApiRequest = {
  listDish: () => http.get<DishListResType>("/dishes"),
  dishDetails: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  createDish: (body: CreateDishBodyType) =>
    http.post<DishResType>("/dishes", body),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};
export default dishApiRequest;
