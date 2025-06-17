import { CategoryDTO } from './category.dto';

export class ProductDTO {
  constructor(
    public id?: number,
    public name?: string,
    public speedDownload?: number,
    public speedUpload?: number,
    public taxaAdesao?: number,
    public valueWifi?: number,
    public value?: number,
    public description?: string,
    public category?: CategoryDTO
  ) {}
}
