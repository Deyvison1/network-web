import { RoleDTO } from "../role.dto";
import { ResponseDTO } from "./response.dto";

export interface RoleDTOResponse extends ResponseDTO {
    body: RoleDTO[];
}