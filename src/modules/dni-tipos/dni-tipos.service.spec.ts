import { Test, TestingModule } from '@nestjs/testing';
import { DniTiposService } from './dni-tipos.service';

describe('DniTiposService', () => {
  let service: DniTiposService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DniTiposService],
    }).compile();

    service = module.get<DniTiposService>(DniTiposService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
