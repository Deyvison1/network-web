import { ActionType } from '../../consts/enums/action-type.enum';
export interface ActionTypeBodyDTO<T> {
    actionType: ActionType;
    body: T;
}