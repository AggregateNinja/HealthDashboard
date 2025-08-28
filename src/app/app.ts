import { Component, signal, inject } from '@angular/core';
import { GithubService } from './services/github.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe, NgClass, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { GithubUser } from './models/github-user'; 

@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    NgIf,
    NgFor,
    DecimalPipe,
    DatePipe,
    NgClass
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  protected readonly title = signal('health-dashboard');

  /*
  score 3/5 - https://api.github.com/repos/github/scientist
  */
  githubUrl = 'https://api.github.com/repos/AggregateNinja/HealthDashboard';
  owner = 'AggregateNinja';
  repo = 'HealthDashboard';  
  user: GithubUser | null = null;
  fileList = ['LICENSE', '.gitignore', 'README.md'];
  fileStatuses: Record<string, boolean> | null = null;
  hasRecent: boolean | null = null;
  hasActions: boolean | null = null;
  currYear = new Date().getFullYear();
  score = 0;
  maxScore = 5;
  displayScore = false;
  percentScore = '';

  private readonly github = inject(GithubService); //constructor(private github: GithubService) {}
  
  /**
   * Parse a GitHub repo URL to extract owner and repo name
  */
  parseGithubUrl(url: string): { owner: string; repo: string } | null {
    try {
      // Remove trailing .git if present
      url = url.replace(/\.git$/, '');

      // Convert to URL object
      const u = new URL(url);

      // Only handle github.com URLs
      if (u.hostname !== 'api.github.com') return null;

      // Split pathname: /owner/repo
      const parts = u.pathname.split('/').filter(Boolean);
     
      if (parts.length < 2) return null;
  
      const owner = parts[1];
      const repo = parts[2];

      return { owner, repo };
    } catch (err) {
      console.log('Error parsing URL:', err);
      return null; // invalid URL
    }
  }

  /**
   * 
   * @returns Fetch data and update score based on repo health
   */
  fetchUserData() {
    this.score = 0;

    const ownerRepo = this.parseGithubUrl(this.githubUrl);
    
    if (!ownerRepo) {
      alert('Invalid GitHub URL');
      return;
    }
    
    this.owner = ownerRepo.owner;
    this.repo = ownerRepo.repo;

    this.fetchUser();
    this.checkFiles();
    this.checkActivity();
    this.checkActions();

    
  }

  /**
   * Fetch GitHub user profile data. Currently not used.
   */
  fetchUser() {
    this.github.getUser(this.owner).subscribe((data) => {
      console.log(data);
      if (data != null) {
        this.user = data;
      }
      
    });
  }

  /**
   * Check for key files in the repo (LICENSE, .gitignore, README.md)
   */
  checkFiles() {
    const observables = this.github.checkRepoFiles(this.owner, this.repo, this.fileList);
    // forkJoin waits for all observables to complete
    forkJoin(observables).subscribe((results) => {
      this.fileStatuses = results;
      if (this.fileStatuses != null) {
        if (this.fileStatuses['LICENSE'] == true) {
          this.score += 1;
        }
        if (this.fileStatuses['.gitignore'] == true) {
          this.score += 1;
        }
        if (this.fileStatuses['README.md'] == true) {
          this.score += 1;
        }
      }
    });
    
    
    
  }

  /**
   * Check if repo has recent commits (default: last 6 months)
   */
  checkActivity() {
    this.github.hasRecentCommits(this.owner, this.repo).subscribe((exists) => {
      if (exists !== null && exists) {
        this.score += 1;
      }
      this.hasRecent = exists;
    });
  }

  /**
   * Check if repo uses GitHub Actions
   */
  checkActions() {
    this.github.usesGithubActions(this.owner, this.repo).subscribe((exists) => {
      if (exists !== null && exists) {
        this.score += 1;
      }
      this.hasActions = exists;
      this.displayScore = true;
    });
  }
  
}
