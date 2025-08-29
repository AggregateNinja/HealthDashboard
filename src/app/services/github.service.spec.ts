import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { GithubService } from './github.service';
import { provideHttpClient } from '@angular/common/http';

describe('GithubService', () => {
  let service: GithubService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GithubService,
        provideHttpClient(), 
        provideHttpClientTesting()
      ],
    });
    service = TestBed.inject(GithubService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getUser calls the expected URL', () => {
    service.getUser('octocat').subscribe(data => expect(data).toBeTruthy());

    const req = httpMock.expectOne(`${service['apiUrl']}/users/octocat`);
    expect(req.request.method).toBe('GET');
    req.flush({ login: 'octocat', id: 1 });
  });
});