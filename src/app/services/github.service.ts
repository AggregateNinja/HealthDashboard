import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../environments/environment';
import { GithubUser } from '../models/github-user'; 

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  private apiUrl = 'https://api.github.com';
  private token = environment.githubToken;

  private http = inject(HttpClient);

  //constructor(private http: HttpClient) {}

  private getHeaders(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.token}`,
      }),
    };
  }

  // Example: get a user’s public profile
  getUser(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.apiUrl}/users/${username}`, this.getHeaders());
  }

  // Example: get repos for a user
  getRepos(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.apiUrl}/users/${username}/repos`, this.getHeaders());
  }

  // Check if a file exists in a repo
  fileExists(owner: string, repo: string, path: string): Observable<boolean> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${path}`;
    return this.http.get(url, this.getHeaders()).pipe(
      map(() => true),                 // If request succeeds, file exists
      catchError((err) => {
        console.log('Error checking file:', err);
        if (err.status === 404) {
          return of(false);           // File not found
        }
        throw err;                     // Other errors rethrow
      })
    );
  }

  // Example: check multiple files
  checkRepoFiles(owner: string, repo: string, files: string[]) {
    const results: Record<string, Observable<boolean>> = {};
    files.forEach((file) => {
      results[file] = this.fileExists(owner, repo, file);
    });
    return results;
  }

  /**
   * Check if repo has commits since a given date
   */
  hasRecentCommits(owner: string, repo: string, months = 6): Observable<boolean | null> {
    const sinceDate = new Date();
    sinceDate.setMonth(sinceDate.getMonth() - months);
    const isoDate = sinceDate.toISOString();

    const url = `${this.apiUrl}/repos/${owner}/${repo}/commits?since=${isoDate}&per_page=1`;
    
    return this.http.get<unknown[]>(url, this.getHeaders()).pipe(
      map((commits) => commits.length > 0),
      catchError((err) => {
        if (err.status === 404) {
          // repo not found
          return of(null);
        }
        throw err; // rethrow other errors
      })
    );
  }

  /**
   * Check if a path exists in a repository
   */
  pathExists(owner: string, repo: string, path: string): Observable<boolean> {
    const url = `${this.apiUrl}/repos/${owner}/${repo}/contents/${path}`;
    return this.http.get(url, this.getHeaders()).pipe(
      map(() => true), // path exists
      catchError((err) => {
        if (err.status === 404) {
          // repo not found
          return of(false);
        }
        throw err; // rethrow other errors
      })
    );
  }

  /**
   * Check if repository uses GitHub Actions
   */
  usesGithubActions(owner: string, repo: string): Observable<boolean> {
    return this.pathExists(owner, repo, '.github/workflows');
  }
}
