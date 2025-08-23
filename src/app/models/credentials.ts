export class CredenciaisDTO {
  constructor(
    public nick: string, public password: string, public token?: string
  ) {}
}
