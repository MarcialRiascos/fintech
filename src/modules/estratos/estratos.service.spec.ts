import { Test, TestingModule } from '@nestjs/testing';
import { EstratosService } from './estratos.service';

describe('EstratosService', () => {
  let service: EstratosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EstratosService],
    }).compile();

    service = module.get<EstratosService>(EstratosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
