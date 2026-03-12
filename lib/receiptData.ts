export interface Movie {
    id: number;
    title: string;
    genres: string;
    duration: string;
    rating: string;
}

/** Placeholder dataset used until the Letterboxd API is wired up. */
export const mockMovies: Movie[] = [
    { id: 1, title: "ANATOMY OF A FALL", genres: "THRILLER, DRAMA", duration: "02:31", rating: "4.5/5.0" },
    { id: 2, title: "POOR THINGS", genres: "COMEDY, SCIFI", duration: "02:21", rating: "4.0/5.0" },
    { id: 3, title: "THE IRON CLAW", genres: "DRAMA, SPORT", duration: "02:12", rating: "4.0/5.0" },
    { id: 4, title: "PERFECT DAYS", genres: "DRAMA", duration: "02:04", rating: "4.5/5.0" },
    { id: 5, title: "PAST LIVES", genres: "ROMANCE, DRAMA", duration: "01:45", rating: "5.0/5.0" },
    { id: 6, title: "OPPENHEIMER", genres: "BIOGRAPHY, DRAMA", duration: "03:00", rating: "4.5/5.0" },
    { id: 7, title: "KILLERS OF THE FLOWER MOON", genres: "CRIME, DRAMA", duration: "03:26", rating: "4.0/5.0" },
    { id: 8, title: "SOCIETY OF THE SNOW", genres: "SURVIVAL, THRILLER", duration: "02:24", rating: "4.5/5.0" },
    { id: 9, title: "SALTBURN", genres: "THRILLER, COMEDY", duration: "02:11", rating: "3.5/5.0" },
    { id: 10, title: "BARBIE", genres: "COMEDY, FANTASY", duration: "01:54", rating: "4.0/5.0" },
    { id: 11, title: "DUNE: PART TWO", genres: "SCIFI, ACTION", duration: "02:46", rating: "4.5/5.0" },
    { id: 12, title: "THE BOY AND THE HERON", genres: "ANIMATION, FANTASY", duration: "02:04", rating: "4.0/5.0" },
    { id: 13, title: "SPIDER-MAN: ACROSS THE SPIDER-VERSE", genres: "ANIMATION, ACTION", duration: "02:20", rating: "4.5/5.0" },
    { id: 14, title: "GODZILLA MINUS ONE", genres: "ACTION, SCIFI", duration: "02:05", rating: "4.0/5.0" },
    { id: 15, title: "ASTEROID CITY", genres: "COMEDY, ROMANCE", duration: "01:45", rating: "3.5/5.0" },
    { id: 16, title: "THE HOLDOVERS", genres: "COMEDY, DRAMA", duration: "02:13", rating: "4.0/5.0" },
    { id: 17, title: "MAY DECEMBER", genres: "COMEDY, DRAMA", duration: "01:57", rating: "3.5/5.0" },
    { id: 18, title: "AMERICAN FICTION", genres: "COMEDY, DRAMA", duration: "01:57", rating: "4.0/5.0" },
    { id: 19, title: "PRISCILLA", genres: "BIOGRAPHY, DRAMA", duration: "01:53", rating: "3.5/5.0" },
    { id: 20, title: "THE ZONE OF INTEREST", genres: "DRAMA, WAR", duration: "01:45", rating: "4.5/5.0" },
];
