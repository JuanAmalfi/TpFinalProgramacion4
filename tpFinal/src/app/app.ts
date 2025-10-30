import { Component, inject, signal } from '@angular/core';
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

}
