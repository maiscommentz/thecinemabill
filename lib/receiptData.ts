export interface Film {
    id: number;
    title: string;
    genres: string;
    duration: string;
    director: string;
    year: string;
    rating: string;
}

/** Placeholder dataset used until the Letterboxd API is wired up. */
export const mockFilms: Film[] = [
    { id: 1, title: "ANATOMY OF A FALL", genres: "THRILLER, DRAMA", duration: "02:31", director: "JUSTINE TRIET", year: "2023", rating: "4.5/5.0" },
    { id: 2, title: "POOR THINGS", genres: "COMEDY, SCIFI", duration: "02:21", director: "YORGOS LANTHIMOS", year: "2023", rating: "4.0/5.0" },
    { id: 3, title: "THE IRON CLAW", genres: "DRAMA, SPORT", duration: "02:12", director: "SEAN DURKIN", year: "2023", rating: "4.0/5.0" },
    { id: 4, title: "PERFECT DAYS", genres: "DRAMA", duration: "02:04", director: "WIM WENDERS", year: "2023", rating: "4.5/5.0" },
    { id: 5, title: "PAST LIVES", genres: "ROMANCE, DRAMA", duration: "01:45", director: "CELINE SONG", year: "2023", rating: "5.0/5.0" },
    { id: 6, title: "OPPENHEIMER", genres: "BIOGRAPHY, DRAMA", duration: "03:00", director: "CHRISTOPHER NOLAN", year: "2023", rating: "4.5/5.0" },
    { id: 7, title: "KILLERS OF THE FLOWER MOON", genres: "CRIME, DRAMA", duration: "03:26", director: "MARTIN SCORSESE", year: "2023", rating: "4.0/5.0" },
    { id: 8, title: "SOCIETY OF THE SNOW", genres: "SURVIVAL, THRILLER", duration: "02:24", director: "J.A. BAYONA", year: "2023", rating: "4.5/5.0" },
    { id: 9, title: "SALTBURN", genres: "THRILLER, COMEDY", duration: "02:11", director: "EMERALD FENNELL", year: "2023", rating: "3.5/5.0" },
    { id: 10, title: "BARBIE", genres: "COMEDY, FANTASY", duration: "01:54", director: "GRETA GERWIG", year: "2023", rating: "4.0/5.0" },
    { id: 11, title: "DUNE: PART TWO", genres: "SCIFI, ACTION", duration: "02:46", director: "DENIS VILLENEUVE", year: "2024", rating: "4.5/5.0" },
    { id: 12, title: "THE BOY AND THE HERON", genres: "ANIMATION, FANTASY", duration: "02:04", director: "HAYAO MIYAZAKI", year: "2023", rating: "4.0/5.0" },
    { id: 13, title: "SPIDER-MAN: ACROSS THE SPIDER-VERSE", genres: "ANIMATION, ACTION", duration: "02:20", director: "JOAQUIM DOS SANTOS", year: "2023", rating: "4.5/5.0" },
    { id: 14, title: "GODZILLA MINUS ONE", genres: "ACTION, SCIFI", duration: "02:05", director: "TAKASHI YAMAZAKI", year: "2023", rating: "4.0/5.0" },
    { id: 15, title: "ASTEROID CITY", genres: "COMEDY, ROMANCE", duration: "01:45", director: "WES ANDERSON", year: "2023", rating: "3.5/5.0" },
    { id: 16, title: "THE HOLDOVERS", genres: "COMEDY, DRAMA", duration: "02:13", director: "ALEXANDER PAYNE", year: "2023", rating: "4.0/5.0" },
    { id: 17, title: "MAY DECEMBER", genres: "COMEDY, DRAMA", duration: "01:57", director: "TODD HAYNES", year: "2023", rating: "3.5/5.0" },
    { id: 18, title: "AMERICAN FICTION", genres: "COMEDY, DRAMA", duration: "01:57", director: "CORD JEFFERSON", year: "2023", rating: "4.0/5.0" },
    { id: 19, title: "PRISCILLA", genres: "BIOGRAPHY, DRAMA", duration: "01:53", director: "SOFIA COPPOLA", year: "2023", rating: "3.5/5.0" },
    { id: 20, title: "THE ZONE OF INTEREST", genres: "DRAMA, WAR", duration: "01:45", director: "JONATHAN GLAZER", year: "2023", rating: "4.5/5.0" },
];
