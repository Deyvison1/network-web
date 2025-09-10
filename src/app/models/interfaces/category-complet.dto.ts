import { UserDTO } from "../user.dto";
import { ICategoryDTO } from "./i-category.dto";

export interface CategoryCompletDTO extends ICategoryDTO  {
  updated: Date;
  created: Date;
  userUpdated: UserDTO;
}
