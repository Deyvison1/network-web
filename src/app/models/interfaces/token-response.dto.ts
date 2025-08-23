import { ResponseDTO } from './response.dto';
import { TokenDTO } from './token.dto';

export class ResponseTokenDTO extends ResponseDTO {
  body: TokenDTO;
}
