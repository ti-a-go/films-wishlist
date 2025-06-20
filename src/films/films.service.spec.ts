import { FilmsService } from './films.service';
import { TestBed } from '@suites/unit';

describe('FilmsService', () => {
  let service: FilmsService;

  beforeEach(async () => {
    const { unit } = await TestBed.solitary(FilmsService).compile();

    service = unit;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
