import type { FoodSpot, FoodSpotPage } from "../entity/food-spot.entity";
import type { JejuCityFilter } from "../jeju-region";

export interface FoodSpotRepository {
  getPage(
    pageNo: number,
    pageSize: number,
    cityFilter?: JejuCityFilter,
  ): Promise<FoodSpotPage>;
  getById(id: string): Promise<FoodSpot | null>;
}
