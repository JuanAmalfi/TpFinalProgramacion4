import { Component, HostListener, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/shared/header/header/header";
import { Footer } from "./components/shared/footer/footer/footer";
import { AuthService } from './components/log/auth/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('tpFinal');
  protected auth=inject(AuthService);



  // === Listener para el scroll ===
  @HostListener('window:scroll')
  onScroll() {
    const header = document.querySelector('.main-header');
    const logo = document.querySelector('.logo-text');

    if (window.scrollY > 20) {
      header?.classList.add('shrink');
      logo?.classList.add('shrink');
    } else {
      header?.classList.remove('shrink');
      logo?.classList.remove('shrink');
    }
  }

}
