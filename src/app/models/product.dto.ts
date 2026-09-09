import { CategoryDTO } from './category.dto';

export interface ProductDTO {
  id: string;
  name: string;
  speedDownload: number;
  speedUpload: number;
  taxaAdesao: number;
  valueWifi: number;
  value: number;
  description: string;
  categoryId: string;
}

export interface ProductCategoryCompletDTO {
  id: string;
  name: string;
  speedDownload: number;
  speedUpload: number;
  taxaAdesao: number;
  valueWifi: number;
  value: number;
  description: string;
  category: CategoryDTO;
}
