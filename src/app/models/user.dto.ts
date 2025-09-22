import { RoleDTO } from "./role.dto";

export class UserDTO {
  constructor(
    public nick?: string,
    public password?: string,
    public email?: string,
    public roles?: RoleDTO[],
    public userName?: string,
    public uuid?: string,
    public created?: Date,
    public updated?: Date
  ) {}
}