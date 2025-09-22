interface Page {
  totalElements: number;
  size: number;
}

export interface PageResponseDTO<T> {
  page: Page;
  content: T;
}


export interface ResponseDTOPage<D> {
  totalElements: number;
  content: D;
  size: number;
}