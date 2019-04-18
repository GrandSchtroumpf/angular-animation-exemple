import { Component, OnInit } from '@angular/core';
import { query, style, stagger, trigger, transition, animate } from '@angular/animations';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { hidden, easeOut, shown, easeIn } from './animations';

const ORGS = [
  { title: 'Org 1', moviesId: [0, 1, 2, 3] },
  { title: 'Org 2', moviesId: [4, 5, 6, 7, 8, 9, 10] }
];
const MOVIES = Array(7).fill({name: 'Name'}).map((movie, id) => ({...movie, id}));

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('org', [
      transition(':enter', [
        query('.org', [
          hidden('{{direction}}'),
          stagger(50, [ animate(`200ms ${easeOut}`, shown('{{direction}}')) ])
        ])
      ], { params : { direction: 'X' }}),
    ]),
    trigger('org', [
      transition(':leave', [
        query('.org', [
          shown('{{direction}}'),
          stagger(50, [ animate(`200ms ${easeIn}`, hidden('{{direction}}')) ])
        ])
      ], { params : { direction: 'X' }}),
    ]),
    trigger('list', [
      transition(':enter', [
        query('mat-card', [
          hidden('{{direction}}'),
          stagger(10, [ animate(`400ms ${easeOut}`, shown('{{direction}}')) ])
        ]),
      ], { params : { direction: 'X' }}),
      transition(':leave', [
        query('mat-card', [
          shown('{{direction}}'),
          stagger(-10, [ animate(`400ms ${easeIn}`, hidden('{{direction}}')) ])
        ]),
      ], { params : { direction: 'X' }})
    ]),

    trigger('item', [
      transition(':enter', [
        hidden('{{direction}}'),
        animate(`200ms ${easeOut}`, shown('{{direction}}'))
      ], { params : { direction: 'X' }}),
      transition(':leave', [
        shown('{{direction}}'),
        animate(`200ms ${easeIn}`, hidden('{{direction}}'))
      ], { params : { direction: 'X' }})
    ])
  ]
})
export class AppComponent implements OnInit {
  private id = MOVIES.length;
  public isVisible = true;
  public orgs$: Observable<any[]>;
  public direction = 'Y';

  private _organizations = new BehaviorSubject(ORGS);
  public organizations$ = this._organizations.asObservable();
  private _movies = new BehaviorSubject(MOVIES);
  public movies$ = this._movies.asObservable();

  ngOnInit() {
    this.orgs$ = this.organizations$.pipe(
      switchMap(orgs => {
        const orgsWithMovie = orgs.map(org => {
          return this.movies$.pipe(
            map(movies => movies.filter(movie => org.moviesId.includes(movie.id))),
            map(movies => ({ ...org, movies }))
          );
        });
        return combineLatest(orgsWithMovie);
      })
    );
  }

  public trackOrg(index, org) {
    return index;
  }
  public trackMovie(index, movie) {
    return movie.id;
  }

  public changeDirection() {
    this.direction = (this.direction === 'X') ? 'Y' : 'X';
    console.log(this.direction);
  }

  public add() {
    this.id = this.id + 1;
    this._movies.next([
      ...this._movies.getValue(),
      { name: 'New Movie', id: this.id }
    ]);
  }

  public remove() {
    this.id = this.id - 1;
    const movies = this._movies.getValue();
    movies.pop();
    this._movies.next(movies);
  }
}
