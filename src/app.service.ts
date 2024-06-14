import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHint(): string {
    return 'С полной документацией API можно ознакомиться по адресу http://localhost:5000/api или {yourBaseUrl}/api';
  }
}
