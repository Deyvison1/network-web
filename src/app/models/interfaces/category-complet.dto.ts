import { ICategoryDTO } from "./icategory.dto";

export interface CategoryCompletDTO extends ICategoryDTO  {
  updateDate: Date;
  creationDate: Date;
}
