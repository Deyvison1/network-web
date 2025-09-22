import { PageConfig } from "./page.config";

export interface Filter<T> {
    pageConfig: PageConfig;
    entity: T
}