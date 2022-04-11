import { Injectable } from '@nestjs/common';
import { GetHelloResponseDTO } from '@osk/shared/dto/hello/GetHelloResponseDTO';

@Injectable()
export class AppService {
  getHello(): GetHelloResponseDTO {
    return {
      text: 'Hello World!',
    };
  }
}
