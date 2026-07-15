import type { FoodSpotPage } from "../entity/food-spot.entity";
import type { JejuCityFilter } from "../jeju-region";
import type { FoodSpotRepository } from "../repository/food-spot.repository";

export const FOOD_SPOTS_DEFAULT_PAGE_SIZE = 10;

export async function getJejuFoodSpotsPage(
  foodSpotRepository: FoodSpotRepository,
  pageNo: number,
  cityFilter?: JejuCityFilter,
  pageSize: number = FOOD_SPOTS_DEFAULT_PAGE_SIZE,
): Promise<FoodSpotPage> {
  return foodSpotRepository.getPage(pageNo, pageSize, cityFilter);
}
