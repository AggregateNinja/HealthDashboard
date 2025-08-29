import { Component, signal, inject, ElementRef, ViewChild } from '@angular/core';
import { GithubService } from './services/github.service';
import { FormsModule } from '@angular/forms';
import { NgIf, NgFor, DecimalPipe, NgClass, DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { GithubUser } from './models/github-user'; 
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

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
  
  protected readonly title = signal('GitHub Repository Health Checker');

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
  @ViewChild('pdfSource', { static: false }) pdfSource!: ElementRef;

  private readonly github = inject(GithubService); //constructor(private github: GithubService) {}
  
  /**
   * Export the current view as a PDF
   * Commented out because it causes ng lint to fail
   */
  async exportAsPdf() {
      const el = this.pdfSource.nativeElement as HTMLElement;

      // High-DPI canvas for sharper text
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });

      const pdf = new jsPDF('p', 'pt', 'a4');
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight() - 580;

      const imgW = pageW;
      const imgH = canvas.height * (imgW / canvas.width);

      let y = 0;
      while (y < imgH) {
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.min(canvas.height, Math.floor(pageH * (canvas.width / pageW)));
        const ctx = pageCanvas.getContext('2d')!;
        ctx.drawImage(
          canvas,
          0, y * (canvas.width / pageW),
          canvas.width, pageCanvas.height,
          0, 0,
          pageCanvas.width, pageCanvas.height
        );
        const pageImg = pageCanvas.toDataURL('image/png');
        if (y > 0) pdf.addPage();
        pdf.addImage(pageImg, 'PNG', 0, 0, pageW, pageH);
        y += pageCanvas.height * (pageW / canvas.width);
      }

      pdf.save('document.pdf');
    }

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
