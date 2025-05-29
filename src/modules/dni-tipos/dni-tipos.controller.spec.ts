import { Test, TestingModule } from '@nestjs/testing';
import { DniTiposController } from './dni-tipos.controller';
import { DniTiposService } from './dni-tipos.service';

describe('DniTiposController', () => {
  let controller: DniTiposController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DniTiposController],
      providers: [DniTiposService],
    }).compile();

    controller = module.get<DniTiposController>(DniTiposController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
