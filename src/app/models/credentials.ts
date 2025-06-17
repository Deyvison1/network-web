export class CredenciaisDTO {
  constructor(
    public login: string, public senha: string, public token?: string
  ) {}
}
