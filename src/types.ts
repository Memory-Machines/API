/* eslint-disable @typescript-eslint/no-namespace */

export namespace mb {
  export interface User {
    firstName: string;
    lastName: string;
    memberType: User.memberType;
    address: string;
    birthday: string;
    createdBy: string;
    email: string;
    password: string;
  }

  export namespace User {
    export type memberType = 'user' | 'family' | 'friend' | 'caretaker';

    export interface UserDoc extends User {
      _id: string;
      createdAt: string;
      updatedAt: string;
    }
  }

  export interface Memory {
    user: string;
    song: string;
    text: string;
    tags: Array<string>;
    createdBy: string;
  }

  export namespace Memory {
    export interface MemoryDoc extends Memory {
      _id: string;
      createdAt: string;
      updatedAt: string;
    }
  }

  export interface Song {
    title: string;
    artist: string;
    user: string;
    year: number;
    spotifyLink: string;
    youTubeLink?: string;
    favorite?: boolean;
  }

  export namespace Song {
    export interface SongDoc extends Song {
      _id: string;
      createdAt: string;
      updatedAt: string;
    }
  }

  export interface SpotifyAuth {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
  }
}
