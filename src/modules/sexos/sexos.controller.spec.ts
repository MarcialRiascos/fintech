import { Test, TestingModule } from '@nestjs/testing';
import { SexosController } from './sexos.controller';
import { SexosService } from './sexos.service';

describe('SexosController', () => {
  let controller: SexosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SexosController],
      providers: [SexosService],
    }).compile();

    controller = module.get<SexosController>(SexosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
