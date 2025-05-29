import { Test, TestingModule } from '@nestjs/testing';
import { EstratosController } from './estratos.controller';
import { EstratosService } from './estratos.service';

describe('EstratosController', () => {
  let controller: EstratosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstratosController],
      providers: [EstratosService],
    }).compile();

    controller = module.get<EstratosController>(EstratosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
