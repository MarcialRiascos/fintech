import { Test, TestingModule } from '@nestjs/testing';
import { SexosService } from './sexos.service';

describe('SexosService', () => {
  let service: SexosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SexosService],
    }).compile();

    service = module.get<SexosService>(SexosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
