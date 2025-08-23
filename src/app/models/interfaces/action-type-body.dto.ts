import { ActionType } from './../../consts/enums/cction-type.enum';
export interface ActionTypeBodyDTO<T> {
    actionType: ActionType;
    body: T;
}