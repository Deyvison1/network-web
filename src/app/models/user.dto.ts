export class UserDTO {
  constructor(
    public nick?: string,
    public password?: string,
    public email?: string,
    public roles?: string[],
    public userName?: string,
    public uuid?: number,
    public createdAt?: Date,
    public updatedAt?: Date
  ) {}
}