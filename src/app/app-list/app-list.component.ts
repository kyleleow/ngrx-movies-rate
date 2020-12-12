import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Movie } from '../models/movie.model';
import { MovieService } from '../movie.service';
import { getRandomInteger, getTimer } from '../utilities';

@Component({
  selector: 'app-list',
  templateUrl: './app-list.component.html',
  styleUrls: ['./app-list.component.scss']
})
export class AppListComponent implements OnInit {

  constructor(
    private store: Store<{ movies: Movie[] }>,
    private movieService: MovieService
  ) { }

  tableHeaders = ['Title', 'Rating'];
  movies$: Observable<Movie[]> = this.movieService.getMoviesByDescendingRate();
  isRating = false;
  ratingTimeout = 0;
  countdown$: Observable<number> = getTimer(0);

  ngOnInit(): void {
    this.store.dispatch({ type: '[List Page] Load Movies' });
  }

  startRandomRate(): void {
    this.isRating = true;
    this.setRatingTimeout();
  }

  stopRandomRate(): void {
    this.isRating = false;
    if (this.ratingTimeout) {
      clearTimeout(this.ratingTimeout);
    }
  }

  setRatingTimeout(): void {
    if (this.isRating) {
      const timeoutInSeconds = getRandomInteger();
      this.resetCountdown(timeoutInSeconds);
      this.ratingTimeout = window.setTimeout(() => {
        this.store.dispatch({ type: '[List Page] Rate Movies' });
        this.setRatingTimeout();
      }, timeoutInSeconds * 1000);
    }
  }

  resetCountdown(newTime: number): void {
    this.countdown$ = getTimer(newTime);
  }
}
