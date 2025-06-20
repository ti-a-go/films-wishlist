import { FilmsController } from './films.controller';
import { TestBed } from '@suites/unit';
// import { Mocked, TestBed } from '@suites/unit';
// import { UsersService } from '../users/users.service';
// import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  // let usersService: Mocked<UsersService>;
  // let filmsService: Mocked<FilmsService>;

  beforeAll(async () => {
    const {
      unit,
      // unitRef
    } = await TestBed.solitary(FilmsController).compile();

    controller = unit;
    // usersService = unitRef.get(UsersService);
    // filmsService = unitRef.get(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
