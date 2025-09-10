export class UserDTO {
  constructor(
    public nick?: string,
    public password?: string,
    public email?: string,
    public roles?: string[],
    public userName?: string,
    public uuid?: string,
    public created?: Date,
    public updated?: Date
  ) {}
}