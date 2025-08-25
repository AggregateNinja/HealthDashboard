import { Component, signal, OnInit } from '@angular/core';
//import { RouterOutlet } from '@angular/router';
import { GithubService } from './services/github.service';
import { FormsModule } from '@angular/forms';
//import { JsonPipe } from '@angular/common';
import { NgIf, NgFor } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [
    //RouterOutlet
    FormsModule,
    //JsonPipe,
    NgIf,
    NgFor
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  
  
  protected readonly title = signal('health-dashboard');
  githubUrl = 'https://api.github.com/repos/AggregateNinja/HealthDashboard';
  owner = 'AggregateNinja';
  repo = 'HealthDashboard';  
  user: any;
  fileList = ['LICENSE', '.gitignore', 'README.md'];
  fileStatuses: Record<string, boolean> | null = null;
  hasRecent: boolean | null = null;
  hasActions: boolean | null = null;

  constructor(private github: GithubService) {}

  ngOnInit() {
    //this.fetchUser();
  }

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
      return null; // invalid URL
    }
  }

  fetchUserData() {

    const ownerRepo = this.parseGithubUrl(this.githubUrl);
    
    if (!ownerRepo) {
      alert('Invalid GitHub URL');
      return;
    }
    
    this.owner = ownerRepo.owner;
    this.repo = ownerRepo.repo;

    //this.fetchUser();
    this.checkFiles();
    this.checkActivity();
    this.checkActions();
  }

  fetchUser() {
    this.github.getUser(this.owner).subscribe((data) => {
      this.user = data;
    });
  }

  checkFiles() {
    const observables = this.github.checkRepoFiles(this.owner, this.repo, this.fileList);
    // forkJoin waits for all observables to complete
    forkJoin(observables).subscribe((results) => {
      this.fileStatuses = results;
    });
  }

  checkActivity() {
    this.github.hasRecentCommits(this.owner, this.repo).subscribe((exists) => {
      this.hasRecent = exists;
      console.log('Recent commits:', exists);
    });
  }

  checkActions() {
    this.github.usesGithubActions(this.owner, this.repo).subscribe((exists) => {
      this.hasActions = exists;
    });
  }
  
}
