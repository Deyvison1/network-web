export interface PageResponseDTO<T> {
    size: number;
    totalElements: number;
    content: T;
}