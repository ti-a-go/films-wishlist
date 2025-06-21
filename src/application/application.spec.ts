import { Test, TestingModule } from '@nestjs/testing';
import { Application } from './application';

describe('Application', () => {
  let provider: Application;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Application],
    }).compile();

    provider = module.get<Application>(Application);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
