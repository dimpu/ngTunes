import {Injectable, Inject} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {Store, Reducer, Action} from '@ngrx/store';

import {LogService} from './index';

// analytics
const CATEGORY: string = 'Spotify';

/**
 * ngrx setup start --
 */
export interface ISpotifyState {
  term?: string;
  results?: Array<any>;
}

const initialState: ISpotifyState = {
  results: []
};

interface ISPOTIFY_ACTIONS {
  RESULTS_CHANGE: string;
}

export const SPOTIFY_ACTIONS: ISPOTIFY_ACTIONS = {
  RESULTS_CHANGE: `[${CATEGORY}] RESULTS_CHANGE`
};

export const spotifyReducer: Reducer<ISpotifyState> = (state: ISpotifyState = initialState, action: Action) => {
  let changeState = () => {
    return Object.assign({}, state, action.payload);
  };
  switch (action.type) {
    case SPOTIFY_ACTIONS.RESULTS_CHANGE:
      return changeState();
    default:
      return state;
  }
};
/**
 * ngrx end --
 */

const SEARCH_API: string = 'https://api.spotify.com/v1/search';

@Injectable()
export class SpotifyService {
  public state$: Observable<any>;
  
  constructor(private http: Http, private logger: LogService, private store: Store<any>) {
    this.state$ = store.select('spotify');
  }

  public search(query: string, type?: string): Observable<any[]> {
    return this.http.get(SEARCH_API + `?q=${query}&type=${type || 'track'}`)
      .map(this.extractData);
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body || { };
  }
}
